import { db } from '@/db/connection'
import { theme, tenants } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  domain: string
}

export interface IResponse {
  id: string
  name: string
  domain: string
  theme: {
    logo: string
    favicon: string
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
}

export class GetTenantByDomainService {
  async execute({ domain }: IRequest): Promise<IResponse> {
    const [tenantData] = await db
      .select({
        id: tenants.id,
        name: tenants.name,
        domain: tenants.domain,
        theme: {
          logo: theme.logo,
          favicon: theme.favicon,
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          backgroundColor: theme.backgroundColor,
        },
      })
      .from(tenants)
      .where(eq(tenants.domain, domain))
      .leftJoin(theme, eq(tenants.id, theme.tenantId))

    if (!tenantData || tenantData.theme === null) {
      throw new AppError('Cliente não encontrado', 404)
    }

    const response: IResponse = {
      id: tenantData.id,
      name: tenantData.name,
      domain: tenantData.domain,
      theme: {
        logo: tenantData.theme.logo || '',
        favicon: tenantData.theme.favicon || '',
        primaryColor: tenantData.theme.primaryColor || '#000000',
        secondaryColor: tenantData.theme.secondaryColor || '#FFFFFF',
        backgroundColor: tenantData.theme.backgroundColor || '#F0F0F0',
      },
    }

    return response
  }
}
