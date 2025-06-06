import { Elysia, t } from 'elysia'

import { CreateClientService } from './create-client.service'

export const createClient = new Elysia()
  .decorate({
    createClientService: new CreateClientService(),
  })
  .post(
    '/clients/create',
    async ({ createClientService, body }) => {
      const { name, phone } = body

      await createClientService.execute({
        name,
        phone,
      })
    },
    {
      body: t.Object({
        name: t.String(),
        phone: t.String(),
      }),
    },
  )
