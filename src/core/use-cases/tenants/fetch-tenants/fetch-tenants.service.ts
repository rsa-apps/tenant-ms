import { db } from '@/db/connection'
import { TenantConfigs, tenants } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { eq } from 'drizzle-orm'

export interface IResponse {
  tenantsData: {
    id: string
    name: string
    document: string
    domain: string
    status: boolean
    createdAt: Date
  }[]
}

export class FetchTenantsService {
  async execute(): Promise<IResponse> {
    const tenant = await db
      .select()
      .from(tenants)
      .leftJoin(TenantConfigs, eq(tenants.id, TenantConfigs.tenantId))

    if (!tenant) {
      throw new AppError('Cliente não encontrado', 404)
    }

    const response: IResponse = {
      tenantsData: tenant.map((t) => ({
        id: t.tenants.id,
        name: t.tenants.name,
        document: t.tenants.document,
        domain: t.tenants.domain,
        status: t.tenant_configs?.isActive || false,
        createdAt: t.tenants.created_at,
      })),
    }

    console.log(response)

    return response
  }
}
