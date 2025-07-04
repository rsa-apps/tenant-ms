import { db } from '@/db/connection'
import { tenants } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'

export interface IResponse {
  tenantsData: {
    id: string
    name: string
    domain: string
    status: boolean
    createdAt: Date
  }[]
}

export class FetchTenantsService {
  async execute(): Promise<IResponse> {
    const tenant = await db.select().from(tenants)

    if (!tenant) {
      throw new AppError('Cliente não encontrado', 404)
    }

    const response: IResponse = {
      tenantsData: tenant.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        status: tenant.status || false,
        createdAt: tenant.created_at,
      })),
    }

    return response
  }
}
