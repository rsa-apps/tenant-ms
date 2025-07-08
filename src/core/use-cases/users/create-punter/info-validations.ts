import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { and, eq } from 'drizzle-orm'

export interface IRequest {
  tenantId: string
  vatCode?: string
  username?: string
  email: string
  phone?: string
}

export async function createPunterInfoValidation({
  tenantId,
  vatCode,
  phone,
  username,
  email,
}: IRequest): Promise<void> {
  if (vatCode) {
    const [alreadyDocumentExists] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.vatCode, vatCode)))

    if (alreadyDocumentExists) {
      throw new AppError('Este documento já está cadastrado', 400)
    }
  }

  if (phone) {
    const [alreadyPhoneExists] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.phoneNumber, phone)))

    if (alreadyPhoneExists) {
      throw new AppError('Número de telefone já cadastrado', 400)
    }
  }

  if (username) {
    const [alreadyUsernameExists] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.username, username)))

    if (alreadyUsernameExists) {
      throw new AppError('Usuário já cadastrado', 400)
    }
  }

  const [alreadyEmailExists] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.tenantId, tenantId), eq(users.email, email)))

  if (alreadyEmailExists) {
    throw new AppError('Email já cadastrado', 400)
  }
}
