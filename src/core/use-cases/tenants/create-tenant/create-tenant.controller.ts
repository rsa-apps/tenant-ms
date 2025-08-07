import { Elysia, t } from 'elysia'

import { CreateTenantService } from './create-tenant.service'

export const createTenant = new Elysia()
  .decorate({
    createTenantService: new CreateTenantService(),
  })
  .post(
    '/tenants/create',
    async ({ createTenantService, body, set }) => {
      await createTenantService.execute({
        name: body.name,
        domain: body.domain,
      })

      set.status = 201
    },
    {
      body: t.Object(
        {
          name: t.String(),
          domain: t.String(),
        },
        {
          additionalProperties: true,
        },
      ),
    },
  )
