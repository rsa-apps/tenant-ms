import { db } from '@/db/connection'
import { clients } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  name: string
  phone: string
}

export class CreateClientService {
  async execute({ name, phone }: IRequest) {
    const clientNameAlreadyExists = await db
      .select({
        id: clients.id,
      })
      .from(clients)
      .where(eq(clients.name, name))

    if (clientNameAlreadyExists.length > 0) {
      throw new AppError('Nome do cliente já existe', 400)
    }

    phone = `55${phone.replace(/\D/g, '')}`

    const phoneAlreadyExists = await db
      .select({
        id: clients.id,
      })
      .from(clients)
      .where(eq(clients.name, name))

    if (phoneAlreadyExists.length > 0) {
      throw new AppError('Telefone já existe', 400)
    }

    await db
      .insert(clients)
      .values({
        name,
        phone,
      })
      .returning()
  }
}
