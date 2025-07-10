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
  wallet: {
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
        wallet: {
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
      wallet: {
        credits: userData.wallet.credits || 0,
        bonus: userData.wallet.bonus || 0,
        totalDeposited: userData.wallet.totalDeposited || 0,
        qtyDeposits: userData.wallet.qtyDeposits || 0,
        totalWithdrawn: userData.wallet.totalWithdrawn || 0,
        qtyWithdraws: userData.wallet.qtyWithdraws || 0,
      },
    }
  }
}
