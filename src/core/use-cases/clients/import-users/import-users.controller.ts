import { Elysia, t } from 'elysia'

import { ImportClientsService } from './import-users.service'

export const importClients = new Elysia()
  .decorate({
    importClients: new ImportClientsService(),
  })
  .post(
    '/clients/import',
    async ({ importClients, body }) => {
      await importClients.execute({
        json: body,
      })
    },
    {
      body: t.Array(
        t.Object({
          name: t.String(),
          phone: t.Number(),
        }),
      ),
    },
  )
