import { eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { users } from '@/db/schema'
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
}

export class GetUserByIdService {
  async execute({ userId }: IRequest): Promise<IResponse> {
    const [userData] = await db.select().from(users).where(eq(users.id, userId))

    if (!userData) {
      throw new AppError('User not found', 404)
    }

    return {
      id: userData.id,
      document: userData.vatCode || '',
      phone: userData.phoneNumber || '',
      email: userData.email || '',
      name: userData.name || '',
    }
  }
}
