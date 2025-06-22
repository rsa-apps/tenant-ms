import { db } from '@/db/connection'
import { tenantConfigs, tenants } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { eq } from 'drizzle-orm'

export interface IRequest {
  name: string
  domain: string
}

export class CreateTenantService {
  async execute({ name, domain }: IRequest): Promise<void> {
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
        .values({ name, domain })
        .returning()

      await trx.insert(tenantConfigs).values({ tenantId: tenant.id })
    })
  }
}
