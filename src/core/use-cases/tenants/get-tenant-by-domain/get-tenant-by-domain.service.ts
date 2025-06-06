import { db } from '@/db/connection'
import { tenantConfigs, tenants } from '@/db/schema'
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
    defaultPage: string
  }
}

export class GetTenantByDomainService {
  async execute({ domain }: IRequest): Promise<IResponse> {
    const [tenantData] = await db
      .select({
        id: tenants.id,
        name: tenants.name,
        domain: tenants.domain,
        config: {
          status: tenantConfigs.isActive,
          casinoStatus: tenantConfigs.casinoStatus,
          sportbookStatus: tenantConfigs.sportbookStatus,
          lotteriesStatus: tenantConfigs.lotteriesStatus,
          defaultPage: tenantConfigs.defaultPage,
        },
      })
      .from(tenants)
      .where(eq(tenants.domain, domain))
      .leftJoin(tenantConfigs, eq(tenants.id, tenantConfigs.tenantId))

    if (!tenantData || tenantData.config === null) {
      throw new AppError('Cliente não encontrado', 404)
    }

    const response: IResponse = {
      id: tenantData.id,
      name: tenantData.name,
      domain: tenantData.domain,
      config: {
        status: tenantData.config.status,
        casinoStatus: tenantData.config.casinoStatus,
        sportbookStatus: tenantData.config.sportbookStatus,
        lotteriesStatus: tenantData.config.lotteriesStatus,
        defaultPage: tenantData.config.defaultPage,
      },
    }

    return response
  }
}
