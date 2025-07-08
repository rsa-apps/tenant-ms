import { Elysia, t } from 'elysia'

import { WithdrawApprovedService } from './withdraw-approved.service'

export const withdrawApproved = new Elysia()
  .decorate({
    withdrawApprovedServiceService: new WithdrawApprovedService(),
  })
  .post(
    '/transactions/withdraw-approved',
    async ({ withdrawApprovedServiceService, body }) => {
      const { userId, amount } = body

      const userData = await withdrawApprovedServiceService.execute({
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
