import { and, eq } from 'drizzle-orm'
import dayjs from 'dayjs'
import { resend } from '@/lib/resend'

import { db } from '@/db/connection'
import { tenants, users, userTokens } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import ResetPasswordEmail from '@/domain/emails/forgot-password'

interface IRequest {
  tenantId: string
  email: string
}

export class SendForgotPasswordMailService {
  async execute({ tenantId, email }: IRequest): Promise<void> {
    const [tenant] = await db
      .select({
        tenantId: tenants.id,
        name: tenants.name,
        domain: tenants.domain,
      })
      .from(tenants)
      .where(eq(tenants.id, tenantId))

    if (!tenant) {
      throw new AppError('Company does not exists!', 404)
    }

    const [user] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.email, email)))

    if (!user) {
      throw new AppError('User does not exists!', 404)
    }

    const token = crypto.randomUUID()

    const expires = dayjs().add(3, 'hours').toDate()

    await db.insert(userTokens).values({
      userId: user.id,
      token,
      expires,
    })

    await resend.emails.send({
      from: 'suport@rsa.bet',
      to: email,
      subject: 'Reset your password',
      react: ResetPasswordEmail({
        userFirstname: user.name || 'User',
        resetPasswordLink: `${tenant.domain}/reset-password/${token}`,
      }),
    })
  }
}
