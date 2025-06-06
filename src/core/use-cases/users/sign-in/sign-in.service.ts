import { db } from '@/db/connection'
import { userConfig, users, wallets } from '@/db/schema/users'
import { AppError } from '@/domain/errors/AppError'
import { and, eq, or } from 'drizzle-orm'

interface IRequest {
  tenantId: string
  login: string
  password: string
}

export interface IResponse {
  id: string
  email: string
  wallet: {
    balance: number
    credits: number
    bonus: number
  }
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
      .leftJoin(wallets, eq(users.id, wallets.userId))

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
      email: userData.users.email,
      wallet: {
        balance: Number(wallets.credits) + Number(wallets.bonus),
        credits: Number(wallets.credits),
        bonus: Number(wallets.bonus),
      },
      userConfig: {
        role: userData.user_config.role,
      },
    }
  }
}
