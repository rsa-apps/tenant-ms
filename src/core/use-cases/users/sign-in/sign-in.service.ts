import { db } from '@/db/connection'
import { userConfig, users } from '@/db/schema/users'
import { AppError } from '@/domain/errors/AppError'
import { and, eq, or } from 'drizzle-orm'

interface IRequest {
  tenantId: string
  login: string
  password: string
}

export interface IResponse {
  id: string
  username: string
  email: string
  wallet: number
  userConfig: {
    role: string
  }
}

export class SignInService {
  async execute({ tenantId, login, password }: IRequest): Promise<IResponse> {
    const [userData] = await db
      .select()
      .from(users)
      .where(
        or(
          and(eq(users.tenantId, tenantId), eq(users.username, login)),
          and(eq(users.tenantId, tenantId), eq(users.email, login)),
        ),
      )
      .leftJoin(userConfig, eq(users.id, userConfig.userId))

    if (!userData) {
      throw new AppError('Invalid credentials', 400)
    }

    const passwordHash = await Bun.password.verify(
      password,
      userData.users.password,
    )

    if (!passwordHash) {
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
      username: userData.users.username,
      email: userData.users.email,
      wallet: userData.users.wallet,
      userConfig: {
        role: userData.user_config.role,
      },
    }
  }
}
