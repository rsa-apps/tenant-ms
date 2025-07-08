import { db } from '@/db/connection'
import { users, wallets } from '@/db/schema/users'
import { createPunterInfoValidation } from './info-validations'
import { cpfCnpj } from '@/lib/cpf-cnpj'
import { AppError } from '@/domain/errors/AppError'

export interface IRequest {
  tenantId: string
  vatCode: string
  email: string
  phone: string
  password: string
  coupon?: string
  invitedBy?: string
}

export class CreatePunterService {
  async execute({
    tenantId,
    vatCode,
    email,
    phone,
    password,
    coupon,
    invitedBy,
  }: IRequest): Promise<void> {
    await createPunterInfoValidation({
      tenantId,
      vatCode,
      phone,
      email,
    })

    const { name, birthDate, valid } = await cpfCnpj.verifyDocument({
      vatCode: vatCode.replace(/\D/g, ''),
    })

    if (!valid) {
      throw new AppError('Documento de menor de idade', 400)
    }

    const passwordHash = await Bun.password.hash(password)

    if (phone) {
      phone = `55${phone.replace(/\D/g, '')}`
    }

    await db.transaction(async (trx) => {
      const [user] = await trx
        .insert(users)
        .values({
          tenantId,
          vatCode,
          name,
          birthDate,
          email,
          phoneNumber: phone,
          password: passwordHash,
          invitedBy,
        })
        .returning()

      await trx.insert(wallets).values({ userId: user.id })
    })
  }
}
