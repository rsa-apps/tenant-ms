import { Elysia, t } from 'elysia'

import { CreatePunterService } from './create-punter.service'

export const createPunter = new Elysia()
  .decorate({
    createPunterService: new CreatePunterService(),
  })
  .post(
    '/users/create-punter',
    async ({ createPunterService, body }) => {
      const { tenantId, username, email, password, coupon, invitedBy } = body

      await createPunterService.execute({
        tenantId,
        username,
        email,
        password,
        coupon,
        invitedBy,
      })
    },
    {
      body: t.Object({
        tenantId: t.String(),
        username: t.String(),
        email: t.String(),
        password: t.String(),
        coupon: t.Optional(t.String()),
        invitedBy: t.Optional(t.String()),
      }),
    },
  )
