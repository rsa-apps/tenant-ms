import { Elysia, t } from 'elysia'

import { CreatePunterService } from './create-punter.service'

export const createPunter = new Elysia()
  .decorate({
    createPunterService: new CreatePunterService(),
  })
  .post(
    '/users/create-punter',
    async ({ createPunterService, body }) => {
      const {
        tenantId,
        username,
        name,
        document,
        email,
        phone,
        password,
        coupon,
        invitedBy,
      } = body

      await createPunterService.execute({
        tenantId,
        username,
        name,
        document,
        email,
        phone,
        password,
        coupon,
        invitedBy,
      })
    },
    {
      body: t.Object({
        tenantId: t.String(),
        name: t.Optional(t.String()),
        document: t.Optional(t.String()),
        username: t.Optional(t.String()),
        email: t.String(),
        phone: t.Optional(t.String()),
        password: t.String(),
        coupon: t.Optional(t.String()),
        invitedBy: t.Optional(t.String()),
      }),
    },
  )
