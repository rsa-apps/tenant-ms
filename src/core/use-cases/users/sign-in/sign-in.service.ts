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
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        role: users.role,
        wallet: {
          balance: wallets.balance,
          credits: wallets.credits,
          bonus: wallets.bonus,
        },
      })
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.email, login)))
      .innerJoin(wallets, eq(users.id, wallets.userId))

    if (!userData) {
      throw new AppError('Invalid credentials', 400)
    }

    const passwordHash = await Bun.password.verify(
      password,
      userData.password,
    )

    if (!passwordHash) {
      throw new AppError('Invalid credentials', 400)
    }

    return {
      id: userData.id,
      email: userData.email,
      wallet: {
        balance: userData.wallet.balance / 100,
        credits: userData.wallet.credits / 100,
        bonus: userData.wallet.bonus / 100,
      },
      role: userData.role,
    }
  }
}
