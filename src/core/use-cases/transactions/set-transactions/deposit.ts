import { db } from '@/db/connection'
import { eq } from 'drizzle-orm'
import { dbFunctions } from '@/db/functions'
import { wallets } from '@/db/schema'
import { TransactionStatus, TransactionTypes } from '@/domain/enums/transaction'
import { audits } from '@/db/schema/audits'

interface IRequest {
  userId: string
  transactionId?: string
  amount: number
  status: string
}

export async function depositTransaction({
  userId,
  transactionId,
  amount,
  status,
}: IRequest) {
  switch (status) {
    case TransactionStatus.PAID:
      await db.transaction(async (tx) => {
        await tx
          .update(wallets)
          .set({
            credits: dbFunctions.increment(wallets.credits, amount),
            qtyDeposits: dbFunctions.increment(wallets.qtyDeposits, 1),
          })
          .where(eq(wallets.userId, userId))

        await tx.insert(audits).values({
          action: TransactionTypes.PIX_CASH_IN,
          description: `Deposit of ${amount} credits. Transaction ID: ${transactionId}`,
          responsibleId: userId,
          affectedId: userId,
        })
      })
      break

    default:
      break
  }
}
