import { db } from '@/db/connection'
import { eq } from 'drizzle-orm'
import { dbFunctions } from '@/db/functions'
import { wallets } from '@/db/schema'
import { calcDecrement } from '@/domain/utils/calc-decrement'

interface IRequest {
  userId: string
  amount: number
}

export async function placeBet({
  userId,
  amount,
}: IRequest) {
  const [wallet] = await db.select({
    balance: wallets.balance,
    credits: wallets.credits,
    bonus: wallets.bonus,
  })
  .from(wallets)
  .where(eq(wallets.userId, userId))

  const result = calcDecrement({
    credits: wallet.credits,
    bonus: wallet.bonus,
    balance: wallet.balance,
    betAmount: amount,
  })

  const [walletUpdated] = await db.update(wallets).set({
    balance: dbFunctions.decrement(wallets.balance, result.decrementOnBalance),
    credits: dbFunctions.decrement(wallets.credits, result.decrementOnCredits),
    bonus: dbFunctions.decrement(wallets.bonus, result.decrementOnBonus),
  }).where(eq(wallets.userId, userId)).returning()

  if (!walletUpdated) {
    throw new Error('Failed to update wallet')
  }
}
