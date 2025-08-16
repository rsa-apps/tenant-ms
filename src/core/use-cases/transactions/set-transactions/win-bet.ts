import { db } from '@/db/connection'
import { eq } from 'drizzle-orm'
import { dbFunctions } from '@/db/functions'
import { wallets } from '@/db/schema'

interface IRequest {
  userId: string
  amount: number
}

export async function winBet({
  userId,
  amount,
}: IRequest) {
  const [walletUpdated] = await db.update(wallets).set({
    balance: dbFunctions.increment(wallets.balance, amount),
  }).where(eq(wallets.userId, userId)).returning()

  if (!walletUpdated) {
    throw new Error('Failed to update wallet')
  }
}
