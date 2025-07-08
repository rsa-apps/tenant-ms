import { z } from 'zod'

const envSchema = z.object({
  CPF_CNPJ_API_URL: z.string(),
  CPF_CNPJ_API_PACKAGE: z.string(),
  CPF_CNPJ_API_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.string().default('3001'),
  PAYMENTS_MS_ENDPOINT: z.string().default('http://localhost:3002'),
  LOTTERIES_MS_ENDPOINT: z.string().default('http://localhost:3003'),
  NODE_ENV: z.string().default('development'),
  JWT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
