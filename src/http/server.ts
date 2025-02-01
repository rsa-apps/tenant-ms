import { Elysia } from 'elysia'
// import * as Sentry from '@sentry/bun'
import { routes } from './routes'
import { AppError } from '@/domain/errors/AppError'
import { ZodError } from 'zod'
import { env } from '@/env'

// Sentry.init({
//   dsn: env.SENTRY_DSN,
//   environment: env.NODE_ENV,
//   ignoreErrors: ['AppError', 'ZodError', 'VALIDATION', 'NOT_FOUND', 'PARSE'],
//   enabled: env.NODE_ENV !== 'development',
//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// })

const app = new Elysia()
  .onRequest(({ request }) => {
    console.log(`${request.method} ${request.url}`)
  })
  .error('AppError', AppError)
  .error('ZodError', ZodError)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'AppError':
        set.status = error.statusCode
        return {
          status: 'error',
          message: error.message,
        }
      case 'ZodError':
        set.status = 400
        return {
          status: 'error',
          message: error.toString().replace('Error: ', ''),
        }
      case 'VALIDATION':
        set.status = 400
        return {
          status: 'error',
          message: 'Invalid data',
          error,
        }
      default:
        set.status = 500
        console.error(error)
        // Sentry.captureException(error)
        return {
          status: 'error',
          message: 'Internal server error',
        }
    }
  })

app.use(routes)

app.listen(env.PORT)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
