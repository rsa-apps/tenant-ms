import { eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { users } from '@/db/schema'

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
      throw new Error('User not found')
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
