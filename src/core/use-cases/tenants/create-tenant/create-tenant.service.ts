import { db } from '@/db/connection'
import { TenantConfigs, tenants } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { eq } from 'drizzle-orm'

export interface IRequest {
  name: string
  document: string
  domain: string
}

export class CreateTenantService {
  async execute({ name, document, domain }: IRequest): Promise<void> {
    const [alreadyDocumentExists] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.document, document))

    if (alreadyDocumentExists) {
      throw new AppError('Document already exists', 400)
    }

    const [alreadyDomainExists] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.domain, domain))

    if (alreadyDomainExists) {
      throw new AppError('Domain already exists', 400)
    }

    await db.transaction(async (trx) => {
      const [tenant] = await trx
        .insert(tenants)
        .values({ name, document, domain })
        .returning()

      await trx.insert(TenantConfigs).values({ tenantId: tenant.id })
    })
  }
}
