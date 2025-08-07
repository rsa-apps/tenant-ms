import { Elysia, t } from 'elysia'

import { GetUserByDocService } from './get-user-by-doc.service'

export const getUserByDoc = new Elysia()
  .decorate({
    getUserByDocServiceService: new GetUserByDocService(),
  })
  .post(
    '/users/get-by-doc',
    async ({ getUserByDocServiceService, body }) => {
      const { userDocId } = body

      const userData = await getUserByDocServiceService.execute({
        userDocId,
      })

      return userData
    },
    {
      body: t.Object({
        userDocId: t.String(),
      }),
    },
  )
