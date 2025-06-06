import { db } from '@/db/connection'
import { tenantConfigs } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface IRequest {
  tenantId: string
  status: boolean
}

export class UpdateTenantStatusService {
  async execute({ tenantId, status }: IRequest): Promise<void> {
    console.log('tenantId', tenantId)
    await db
      .update(tenantConfigs)
      .set({ isActive: !status })
      .where(eq(tenantConfigs.tenantId, tenantId))
  }
}
