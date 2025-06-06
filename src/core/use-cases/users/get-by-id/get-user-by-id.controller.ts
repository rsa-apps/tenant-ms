import { Elysia, t } from 'elysia'

import { GetUserByIdService } from './get-user-by-id.service'

export const getUserById = new Elysia()
  .decorate({
    getUserByIdServiceService: new GetUserByIdService(),
  })
  .post(
    '/users/get-by-id',
    async ({ getUserByIdServiceService, body }) => {
      const { userId } = body

      const userData = await getUserByIdServiceService.execute({
        userId,
      })

      return userData
    },
    {
      body: t.Object({
        userId: t.String(),
      }),
    },
  )
