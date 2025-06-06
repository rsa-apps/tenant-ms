import { Elysia } from 'elysia'

import { FetchClientsService } from './fetch-clients.service'

export const fetchClients = new Elysia()
  .decorate({
    fetchClientsService: new FetchClientsService(),
  })
  .get('/clients/fetch', async ({ fetchClientsService }) => {
    const response = await fetchClientsService.execute()

    return response
  })
