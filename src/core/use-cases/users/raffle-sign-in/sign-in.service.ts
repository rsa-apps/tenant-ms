import { db } from '@/db/connection'
import { userConfig, users } from '@/db/schema/users'
import { AppError } from '@/domain/errors/AppError'
import { and, eq } from 'drizzle-orm'

interface IRequest {
  tenantId: string
  phone: string
}

export interface IResponse {
  id: string
  document: string
  phone: string
  userConfig: {
    role: string
  }
}

export class SignInService {
  async execute({ tenantId, phone }: IRequest): Promise<IResponse> {
    phone = `55${phone.replace(/\D/g, '')}`

    const [userData] = await db
      .select()
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.phone, phone)))
      .leftJoin(userConfig, eq(users.id, userConfig.userId))

    if (!userData) {
      throw new AppError('Invalid credentials', 400)
    }

    if (!userData.user_config) {
      throw new AppError('User config not found', 500)
    }

    if (!userData.user_config.status) {
      throw new AppError('User is inactive', 400)
    }

    return {
      id: userData.users.id,
      document: userData.users.document || '',
      phone: userData.users.phone || '',
      userConfig: {
        role: userData.user_config.role,
      },
    }
  }
}
