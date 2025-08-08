import { Elysia, t } from 'elysia'

import { SetTransactionsService } from './set-transactions.service'

export const setTransactions = new Elysia()
  .decorate({
    setTransactionsService: new SetTransactionsService(),
  })
  .put(
    '/transactions',
    async ({ setTransactionsService, body, set }) => {
      const { responsibleId, userId, amount, type, status, transactionId } = body

      await setTransactionsService.execute({
        responsibleId,
        userId,
        amount,
        type,
        status,
        transactionId,
      })

      set.status = 200
    },
    {
      body: t.Object({
        responsibleId: t.Optional(t.String()),
        userId: t.String(),
        amount: t.Number(),
        type: t.String(),
        status: t.String(),
        transactionId: t.Optional(t.String()),
      }),
    },
  )
