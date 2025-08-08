import { eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { users, wallets } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'

interface IRequest {
  userId: string
}

export interface IResponse {
  id: string
  document: string
  phone: string
  email: string
  name: string
  role: string[] | null
  wallet: {
    balance: number
    credits: number
    bonus: number
    totalDeposited: number
    qtyDeposits: number
    totalWithdrawn: number
    qtyWithdraws: number
  }
}

export class GetUserByIdService {
  async execute({ userId }: IRequest): Promise<IResponse> {
    const [userData] = await db
      .select({
        id: users.id,
        vatCode: users.vatCode,
        phoneNumber: users.phoneNumber,
        email: users.email,
        name: users.name,
        role: users.role,
        wallet: {
          balance: wallets.balance,
          credits: wallets.credits,
          bonus: wallets.bonus,
          totalDeposited: wallets.totalDeposited,
          qtyDeposits: wallets.qtyDeposits,
          totalWithdrawn: wallets.totalWithdrawn,
          qtyWithdraws: wallets.qtyWithdraws,
        },
      })
      .from(users)
      .where(eq(users.id, userId))
      .innerJoin(wallets, eq(users.id, wallets.userId))

    if (!userData) {
      throw new AppError('User not found', 404)
    }

    return {
      id: userData.id,
      document: userData.vatCode || '',
      phone: userData.phoneNumber || '',
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role || [""],
      wallet: {
        balance: userData.wallet.balance / 100,
        credits: userData.wallet.credits / 100,
        bonus: userData.wallet.bonus / 100,
        totalDeposited: userData.wallet.totalDeposited,
        qtyDeposits: userData.wallet.qtyDeposits,
        totalWithdrawn: userData.wallet.totalWithdrawn,
        qtyWithdraws: userData.wallet.qtyWithdraws,
      },
    }
  }
}
