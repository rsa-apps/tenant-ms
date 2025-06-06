import { db } from '@/db/connection'
import { clients } from '@/db/schema'

export interface IResponse {
  id: string
  name: string
}

export class FetchClientsService {
  async execute(): Promise<IResponse[]> {
    const clientsData = await db
      .select({
        id: clients.id,
        name: clients.name,
      })
      .from(clients)
      .orderBy(clients.name)

    return clientsData
  }
}
