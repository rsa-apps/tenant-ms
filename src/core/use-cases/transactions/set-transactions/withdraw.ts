import { db } from '@/db/connection'
import { eq } from 'drizzle-orm'
import { dbFunctions } from '@/db/functions'
import { wallets } from '@/db/schema'
import { TransactionStatus, TransactionTypes } from '@/domain/enums/transaction'
import { audits } from '@/db/schema/audits'
import { AppError } from '@/domain/errors/AppError'

interface IRequest {
  userId: string
  transactionId?: string
  amount: number
  status: string
}

export async function withdrawTransaction({
  userId,
  transactionId,
  amount,
  status,
}: IRequest) {
  switch (status) {
    case TransactionStatus.PENDING:
      await db.transaction(async (tx) => {
        const [wallet] = await tx
          .select({ credits: wallets.credits })
          .from(wallets)
          .where(eq(wallets.userId, userId))

        if (wallet.credits < amount) {
          throw new AppError('Saldo insuficiente', 400)
        }

        await tx
          .update(wallets)
          .set({
            credits: dbFunctions.decrement(wallets.credits, amount),
            qtyWithdraws: dbFunctions.increment(wallets.qtyWithdraws, 1),
          })
          .where(eq(wallets.userId, userId))
      })
      break
    case TransactionStatus.PAID:
      await db.transaction(async (tx) => {
        await tx.insert(audits).values({
          action: TransactionTypes.PIX_CASH_OUT,
          description: `Withdraw of ${amount} credits. Transaction ID: ${transactionId}`,
          responsibleId: userId,
          affectedId: userId,
        })
      })
      break
    case TransactionStatus.CANCELED:
      await db.transaction(async (tx) => {
        await tx
          .update(wallets)
          .set({
            credits: dbFunctions.increment(wallets.credits, amount),
          })
          .where(eq(wallets.userId, userId))

        await tx.insert(audits).values({
          action: TransactionTypes.PIX_CASH_OUT,
          description: `Withdraw of ${amount} credits was canceled. Transaction ID: ${transactionId}`,
          responsibleId: userId,
          affectedId: userId,
        })
      })
      break
    default:
      break
  }
}
