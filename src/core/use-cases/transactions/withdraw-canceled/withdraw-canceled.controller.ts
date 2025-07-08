import { Elysia, t } from 'elysia'

import { WithdrawCanceledService } from './withdraw-canceled.service'

export const withdrawCanceled = new Elysia()
  .decorate({
    withdrawCanceledServiceService: new WithdrawCanceledService(),
  })
  .post(
    '/transactions/withdraw-canceled',
    async ({ withdrawCanceledServiceService, body }) => {
      const { userId, amount } = body

      const userData = await withdrawCanceledServiceService.execute({
        userId,
        amount,
      })

      return { user: userData }
    },
    {
      body: t.Object({
        userId: t.String(),
        amount: t.Number(),
      }),
    },
  )
