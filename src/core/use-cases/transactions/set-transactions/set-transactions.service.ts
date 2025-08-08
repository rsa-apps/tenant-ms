import { depositTransaction } from './deposit'
import { withdrawTransaction } from './withdraw'
import { ActionsTypes } from '@/domain/enums/audit'
import { addCredit } from './add-credit'
import { removeCredit } from './remove-credit'
import { AppError } from '@/domain/errors/AppError'
import { placeBet } from './place-bet'
import { winBet } from './win-bet'

interface IRequest {
  responsibleId?: string
  userId: string
  transactionId?: string
  amount: number
  type: string
  status: string
}

export class SetTransactionsService {
  async execute({
    responsibleId,
    userId,
    amount,
    type,
    status,
    transactionId,
  }: IRequest): Promise<void> {
    switch (type) {
      case ActionsTypes.PIX_CASH_IN:
        await depositTransaction({
          userId,
          amount,
          status,
          transactionId,
        })
        break
      case ActionsTypes.PIX_CASH_OUT:
        await withdrawTransaction({
          userId,
          amount,
          status,
          transactionId,
        })
        break
      case ActionsTypes.ADD_CREDIT:
        if (!responsibleId) {
          throw new AppError('Responsible ID is required for ADD_CREDIT action', 400)
        }

        await addCredit({
          responsibleId,
          userId,
          amount,
        })
        break
      case ActionsTypes.REMOVE_CREDIT:
        if (!responsibleId) {
          throw new AppError('Responsible ID is required for ADD_CREDIT action', 400)
        }

        await removeCredit({
          responsibleId,
          userId,
          amount,
        })
        break
      case ActionsTypes.PLACE_BET:
        await placeBet({
          userId,
          amount,
        })
        break
      case ActionsTypes.WIN_BET:
        await winBet({
          userId,
          amount,
        })
        break
    }
  }
}
