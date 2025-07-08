import { Elysia, t } from 'elysia'

import { CreatePunterService } from './create-punter.service'

export const createPunter = new Elysia()
  .decorate({
    createPunterService: new CreatePunterService(),
  })
  .post(
    '/users/create-punter',
    async ({ createPunterService, body }) => {
      const { tenantId, vatCode, email, phone, password, coupon, invitedBy } =
        body

      await createPunterService.execute({
        tenantId,
        vatCode,
        phone,
        email,
        password,
        coupon,
        invitedBy,
      })
    },
    {
      body: t.Object({
        tenantId: t.String(),
        vatCode: t.String(),
        email: t.String(),
        phone: t.String(),
        password: t.String(),
        coupon: t.Optional(t.String()),
        invitedBy: t.Optional(t.String()),
      }),
    },
  )
