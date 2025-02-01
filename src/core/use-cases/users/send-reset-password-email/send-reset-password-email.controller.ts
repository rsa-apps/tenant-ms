import { Elysia, t } from 'elysia'
import { SendForgotPasswordMailService } from './send-reset-password-email.service'

export const sendForgotPasswordMail = new Elysia()
  .decorate({
    sendForgotPasswordMailService: new SendForgotPasswordMailService(),
  })
  .post(
    '/users/forgot-password',
    async ({ sendForgotPasswordMailService, body }) => {
      const { tenantId, email } = body

      await sendForgotPasswordMailService.execute({
        tenantId,
        email,
      })
    },
    {
      body: t.Object({
        tenantId: t.String(),
        email: t.String(),
      }),
    },
  )
