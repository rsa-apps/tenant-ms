import { Elysia, t } from 'elysia'

import { GetTenantByDomainService } from './get-tenant-by-domain.service'

export const getTenantByDomain = new Elysia()
  .decorate({
    getTenantByDomainService: new GetTenantByDomainService(),
  })
  .get(
    '/tenants/get-by-domain',
    async ({ getTenantByDomainService, headers }) => {
      const response = await getTenantByDomainService.execute({
        domain: headers.origin,
      })

      return response
    },
    {
      headers: t.Object({
        origin: t.String(),
      }),
    },
  )
