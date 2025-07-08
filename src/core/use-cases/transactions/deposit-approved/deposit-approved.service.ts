import { db } from '@/db/connection'
import { dbFunctions } from '@/db/functions'
import { wallets } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface IRequest {
  userId: string
  amount: number
}

export class DepositApprovedService {
  async execute({ userId, amount }: IRequest): Promise<void> {
    await db
      .update(wallets)
      .set({
        credits: dbFunctions.increment(wallets.credits, amount),
        totalDeposited: dbFunctions.increment(wallets.totalDeposited, amount),
        qtyDeposits: dbFunctions.increment(wallets.qtyDeposits, 1),
      })
      .where(eq(wallets.userId, userId))
  }
}
