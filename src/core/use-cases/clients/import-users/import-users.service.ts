import { db } from '@/db/connection'
import { clients } from '@/db/schema'

interface IRequest {
  json: {
    name: string
    phone: number
  }[]
}

export class ImportClientsService {
  async execute({ json }: IRequest) {
    await db
      .insert(clients)
      .values(
        json.map((client) => {
          return {
            name: client.name,
            phone: String(client.phone),
          }
        }),
      )
      .execute()
  }
}
