import { Elysia, t } from 'elysia'

import { UpdateTenantStatusService } from './update-tenant-status.service'

export const updateTenantStatus = new Elysia()
  .decorate({
    updateTenantStatusService: new UpdateTenantStatusService(),
  })
  .put(
    '/tenants/update-status',
    async ({ updateTenantStatusService, body }) => {
      const response = await updateTenantStatusService.execute({
        tenantId: body.tenantId,
        status: body.status,
      })

      return response
    },
    {
      body: t.Object({
        tenantId: t.String(),
        status: t.Boolean(),
      }),
    },
  )
