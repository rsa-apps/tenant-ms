import { db } from '@/db/connection'
import { users, wallets } from '@/db/schema/users'
import { AppError } from '@/domain/errors/AppError'
import { and, eq } from 'drizzle-orm'

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
  role: string[] | null
}

export class SignInService {
  async execute({ tenantId, login, password }: IRequest): Promise<IResponse> {
    const [userData] = await db
      .select()
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.email, login)))
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

    return {
      id: userData.users.id,
      email: userData.users.email,
      wallet: {
        balance: Number(wallets.credits) + Number(wallets.bonus) || 0,
        credits: Number(wallets.credits) || 0,
        bonus: Number(wallets.bonus) || 0,
      },
      role: userData.users.role,
    }
  }
}
