import { Elysia, t } from 'elysia'

import { CreateTenantService } from './create-tenant.service'

export const createTenant = new Elysia()
  .decorate({
    createTenantService: new CreateTenantService(),
  })
  .post(
    '/tenants/create',
    async ({ createTenantService, body }) => {
      await createTenantService.execute({
        name: body.name,
        document: body.document,
        domain: body.domain,
      })
    },
    {
      body: t.Object(
        {
          name: t.String(),
          document: t.String(),
          domain: t.String(),
        },
        {
          additionalProperties: true,
        },
      ),
    },
  )
