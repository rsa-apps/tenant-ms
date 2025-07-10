import { TransactionTypes } from '@/domain/enums/transaction'
import { depositTransaction } from './deposit'
import { withdrawTransaction } from './withdraw'

interface IRequest {
  userId: string
  transactionId?: string
  amount: number
  type: string
  status: string
}

export class SetTransactionsService {
  async execute({
    userId,
    amount,
    type,
    status,
    transactionId,
  }: IRequest): Promise<void> {
    switch (type) {
      case TransactionTypes.PIX_CASH_IN:
        await depositTransaction({
          userId,
          amount,
          status,
          transactionId,
        })
        break
      case TransactionTypes.PIX_CASH_OUT:
        await withdrawTransaction({
          userId,
          amount,
          status,
          transactionId,
        })
        break
    }
  }
}
