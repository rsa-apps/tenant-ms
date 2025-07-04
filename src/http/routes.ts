import Elysia from 'elysia'

import { createTenant } from '@/core/use-cases/tenants/create-tenant/create-tenant.controller'
import { fetchTenants } from '@/core/use-cases/tenants/fetch-tenants/fetch-tenants.controller'
import { getTenantByDomain } from '@/core/use-cases/tenants/get-tenant-by-domain/get-tenant-by-domain.controller'
import { updateTenantStatus } from '@/core/use-cases/tenants/update-tenant-status/update-tenant-status.controller'
import { createPunter } from '@/core/use-cases/users/create-punter/create-punter.controller'
import { signIn } from '@/core/use-cases/users/sign-in/sign-in.controller'
import { sendForgotPasswordMail } from '@/core/use-cases/users/send-reset-password-email/send-reset-password-email.controller'
import { getUserById } from '@/core/use-cases/users/get-by-id/get-user-by-id.controller'

export const routes = new Elysia()
  // tenant routes
  .use(createTenant)
  .use(fetchTenants)
  .use(getTenantByDomain)
  .use(updateTenantStatus)

  // user routes
  .use(createPunter)
  .use(signIn)
  .use(getUserById)
  .use(sendForgotPasswordMail)
