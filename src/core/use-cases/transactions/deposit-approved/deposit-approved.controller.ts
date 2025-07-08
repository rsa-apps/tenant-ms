import { Elysia, t } from 'elysia'

import { DepositApprovedService } from './deposit-approved.service'

export const depositApproved = new Elysia()
  .decorate({
    depositApprovedServiceService: new DepositApprovedService(),
  })
  .post(
    '/transactions/deposit-approved',
    async ({ depositApprovedServiceService, body }) => {
      const { userId, amount } = body

      const userData = await depositApprovedServiceService.execute({
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
