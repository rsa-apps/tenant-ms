import { db } from '@/db/connection'
import { tenants } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface IRequest {
  tenantId: string
  status: boolean
}

export class UpdateTenantStatusService {
  async execute({ tenantId, status }: IRequest): Promise<void> {
    console.log('tenantId', tenantId)
    await db
      .update(tenants)
      .set({ status: !status })
      .where(eq(tenants.id, tenantId))
  }
}
