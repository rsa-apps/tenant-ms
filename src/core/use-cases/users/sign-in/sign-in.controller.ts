import { Elysia, t } from 'elysia'

import { SignInService } from './sign-in.service'

export const signIn = new Elysia()
  .decorate({
    signInService: new SignInService(),
  })
  .post(
    '/users/sign-in',
    async ({ signInService, body }) => {
      const { tenantId, login, password } = body

      const userData = await signInService.execute({
        tenantId,
        login,
        password,
      })

      return { user: userData }
    },
    {
      body: t.Object({
        tenantId: t.String(),
        login: t.String(),
        password: t.String(),
      }),
    },
  )
