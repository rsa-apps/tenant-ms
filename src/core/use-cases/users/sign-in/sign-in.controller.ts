import { Elysia, t } from 'elysia'

import { SignInService } from './sign-in.service'
import jwt from '@elysiajs/jwt'
import { env } from '@/env'

export const signIn = new Elysia()
  .decorate({
    signInService: new SignInService(),
  })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
    }),
  )
  .post(
    '/users/sign-in',
    async ({ signInService, jwt, body }) => {
      const { tenantId, login, password } = body

      const userData = await signInService.execute({
        tenantId,
        login,
        password,
      })

      const token = await jwt.sign({ sub: userData.id, exp: 60 * 60 })

      return { token, user: userData }
    },
    {
      body: t.Object({
        tenantId: t.String(),
        login: t.String(),
        password: t.String(),
      }),
    },
  )
