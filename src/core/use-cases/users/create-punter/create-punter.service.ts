import { db } from '@/db/connection'
import { affiliateInfo, userConfig, users } from '@/db/schema/users'
import { AppError } from '@/domain/errors/AppError'
import { and, eq } from 'drizzle-orm'

export interface IRequest {
  tenantId: string
  username: string
  email: string
  password: string
  coupon?: string
  invitedBy?: string
}

export class CreatePunterService {
  async execute({
    tenantId,
    username,
    email,
    password,
    coupon,
    invitedBy,
  }: IRequest): Promise<void> {
    const [alreadyUsernameExists] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.username, username)))

    if (alreadyUsernameExists) {
      throw new AppError('Username already exists', 400)
    }

    const [alreadyEmailExists] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.email, email)))

    if (alreadyEmailExists) {
      throw new AppError('Email already exists', 400)
    }

    const passwordHash = await Bun.password.hash(password)

    await db.transaction(async (trx) => {
      const [user] = await trx
        .insert(users)
        .values({
          tenantId,
          username,
          email,
          password: passwordHash,
          wallet: 0,
          invitedBy,
        })
        .returning()

      await trx.insert(userConfig).values({ userId: user.id })
      await trx.insert(affiliateInfo).values({ userId: user.id })
    })
  }
}
