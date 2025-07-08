import { db } from '@/db/connection'
import { dbFunctions } from '@/db/functions'
import { wallets } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface IRequest {
  userId: string
  amount: number
}

export class WithdrawCanceledService {
  async execute({ userId, amount }: IRequest): Promise<void> {
    await db
      .update(wallets)
      .set({
        credits: dbFunctions.increment(wallets.credits, amount),
        totalWithdrawn: dbFunctions.decrement(wallets.totalWithdrawn, amount),
        qtyWithdraws: dbFunctions.decrement(wallets.qtyWithdraws, 1),
      })
      .where(eq(wallets.userId, userId))
  }
}
