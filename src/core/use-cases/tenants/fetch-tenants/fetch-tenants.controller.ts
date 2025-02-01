import { Elysia } from 'elysia'

import { FetchTenantsService } from './fetch-tenants.service'

export const fetchTenants = new Elysia()
  .decorate({
    fetchTenantsService: new FetchTenantsService(),
  })
  .get('/tenants/fetch', async ({ fetchTenantsService }) => {
    const response = await fetchTenantsService.execute()

    return response
  })
