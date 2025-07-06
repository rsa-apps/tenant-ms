import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string().default('3001'),
  PAYMENTS_MS_ENDPOINT: z.string().default('http://localhost:3002'),
  LOTTERIES_MS_ENDPOINT: z.string().default('http://localhost:3003'),
  NODE_ENV: z.string().default('development'),
  JWT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
