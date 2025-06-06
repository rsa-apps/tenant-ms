import { db } from '@/db/connection'
import { affiliateInfo, userConfig, users, wallets } from '@/db/schema/users'
import { createPunterInfoValidation } from './info-validations'

export interface IRequest {
  tenantId: string
  name?: string
  document?: string
  username?: string
  email: string
  phone?: string
  password: string
  coupon?: string
  invitedBy?: string
}

export class CreatePunterService {
  async execute({
    tenantId,
    name,
    document,
    username,
    email,
    phone,
    password,
    coupon,
    invitedBy,
  }: IRequest): Promise<void> {
    await createPunterInfoValidation({
      tenantId,
      document,
      phone,
      username,
      email,
    })

    const passwordHash = await Bun.password.hash(password)

    if (phone) {
      phone = `55${phone.replace(/\D/g, '')}`
    }

    await db.transaction(async (trx) => {
      const [user] = await trx
        .insert(users)
        .values({
          tenantId,
          username,
          email,
          name,
          document,
          phone,
          password: passwordHash,
          invitedBy,
        })
        .returning()

      await trx.insert(userConfig).values({ userId: user.id })
      await trx.insert(affiliateInfo).values({ userId: user.id })
      await trx.insert(wallets).values({ userId: user.id })
    })
  }
}
