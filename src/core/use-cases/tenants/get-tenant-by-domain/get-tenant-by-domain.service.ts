import { db } from '@/db/connection'
import { TenantConfigs, tenants } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  domain: string
}

export interface IResponse {
  id: string
  name: string
  domain: string
  config: {
    status: boolean
    casinoStatus: boolean
    sportbookStatus: boolean
    lotteriesStatus: boolean
  }
}

export class GetTenantByDomainService {
  async execute({ domain }: IRequest): Promise<IResponse> {
    const [tenantData] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.domain, domain))
      .leftJoin(TenantConfigs, eq(tenants.id, TenantConfigs.tenantId))

    if (!tenantData) {
      throw new AppError('Cliente não encontrado', 404)
    }

    const response: IResponse = {
      id: tenantData.tenants.id,
      name: tenantData.tenants.name,
      domain: tenantData.tenants.domain,
      config: {
        status: tenantData.tenant_configs?.isActive || false,
        casinoStatus: tenantData.tenant_configs?.casinoStatus || false,
        sportbookStatus: tenantData.tenant_configs?.sportbookStatus || false,
        lotteriesStatus: tenantData.tenant_configs?.lotteriesStatus || false,
      },
    }

    console.log(response)

    return response
  }
}
