import { db } from '@/db/connection'
import { dbFunctions } from '@/db/functions'
import { wallets } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface IRequest {
  userId: string
  amount: number
}

export class WithdrawApprovedService {
  async execute({ userId, amount }: IRequest): Promise<void> {
    await db
      .update(wallets)
      .set({
        credits: dbFunctions.decrement(wallets.credits, amount),
        totalWithdrawn: dbFunctions.increment(wallets.totalWithdrawn, amount),
        qtyWithdraws: dbFunctions.increment(wallets.qtyWithdraws, 1),
      })
      .where(eq(wallets.userId, userId))
  }
}
