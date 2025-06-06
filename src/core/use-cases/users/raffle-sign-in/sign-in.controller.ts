import { Elysia, t } from 'elysia'
import jwt from '@elysiajs/jwt'

import { SignInService } from './sign-in.service'
import { env } from '@/env'

export const raffleSignIn = new Elysia()
  .decorate({
    raffleSignInService: new SignInService(),
  })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
    }),
  )
  .post(
    '/users/raffle-sign-in',
    async ({ raffleSignInService, jwt, body }) => {
      const { tenantId, phone } = body

      const userData = await raffleSignInService.execute({
        tenantId,
        phone,
      })

      const token = await jwt.sign({ sub: userData.id, exp: 60 * 60 })

      return { token, user: userData }
    },
    {
      body: t.Object({
        tenantId: t.String(),
        phone: t.String(),
      }),
    },
  )
