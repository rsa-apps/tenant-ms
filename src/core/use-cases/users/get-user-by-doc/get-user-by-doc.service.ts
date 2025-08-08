import { db } from "@/db/connection"
import { affiliationConfig, users, wallets } from "@/db/schema"
import { AppError } from "@/domain/errors/AppError"
import dayjs from "dayjs"
import { eq, or } from "drizzle-orm"

interface IRequest {
  userDocId: string
}

export interface IResponse {
  id: string
  name: string
  email: string
  document: string
  username: string
  phoneNumber: string
  role: string
  birthDate: string
  createdAt: string
  updatedAt: string
  invitedBy: string
  wallet: {
    balance: number
    credits: number
    bonus: number
    totalDeposit: number
    totalWithdrawal: number
  }
  betsCasino: {
    totalBets: number
    totalPrize: number
  }
}

export class GetUserByDocService {
  async execute({ userDocId }: IRequest): Promise<IResponse> {
    const [userData] = await db
      .select({
        id: users.id,
        vatCode: users.vatCode,
        username: users.username,
        birthDate: users.birthDate,
        role: users.role,
        phoneNumber: users.phoneNumber,
        email: users.email,
        name: users.name,
        invitedBy: users.invitedBy,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
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
      .where(eq(users.email, userDocId))
      .innerJoin(wallets, eq(users.id, wallets.userId))

    if (!userData) {
      throw new AppError('User not found', 404)
    }

    return {
      id: userData.id,
      username: userData.username || '',
      document: userData.vatCode || '',
      phoneNumber: userData.phoneNumber || '',
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role ? userData.role[0] : 'PUNTER',
      birthDate: userData.birthDate ? dayjs(userData.birthDate).format("DD/MM/YYYY") : '',
      createdAt: dayjs(userData.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: userData.updatedAt?.toISOString() || userData.createdAt.toISOString(),
      wallet: {
        balance: (userData.wallet.balance) / 100 || 0,
        credits: userData.wallet.credits / 100 || 0,
        bonus: userData.wallet.bonus / 100 || 0,
        totalDeposit: userData.wallet.totalDeposited || 0,
        totalWithdrawal: userData.wallet.totalWithdrawn || 0,
      },
      betsCasino: {
        totalBets: 0, // Placeholder, replace with actual logic if needed
        totalPrize: 0, // Placeholder, replace with actual logic if needed
      },
      invitedBy: userData.invitedBy || '',
    }
  }
}