import { db } from '@/db/connection'
import { theme, tenants } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { env } from '@/env'
import axios from 'axios'
import { eq } from 'drizzle-orm'

interface IRequest {
  domain: string
}

interface PaymentConfigAxios {
  minDeposit: string
  maxDeposit: string
  depositFee: number
  depositSuggestions: number[]
  minWithdraw: string
  maxWithdraw: string
  maxAutoWithdraw: string
  maxWithdrawPerDay: number
}

export interface IResponse {
  id: string
  name: string
  domain: string
  products: string[] | null
  defaultUrl: string
  status: boolean
  theme: {
    logo: string
    favicon: string
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
  paymentConfig: PaymentConfigAxios
}

export class GetTenantByDomainService {
  async execute({ domain }: IRequest): Promise<IResponse> {
    const [tenantData] = await db
      .select({
        id: tenants.id,
        name: tenants.name,
        domain: tenants.domain,
        defaultUrl: tenants.defaultUrl,
        products: tenants.products,
        status: tenants.status,
        theme: {
          logo: theme.logo,
          favicon: theme.favicon,
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          backgroundColor: theme.backgroundColor,
        },
      })
      .from(tenants)
      .where(eq(tenants.domain, domain))
      .leftJoin(theme, eq(tenants.id, theme.tenantId))

    if (!tenantData || !tenantData.theme) {
      throw new AppError('Cliente não encontrado', 404)
    }

    const paymentConfig = await axios.post<PaymentConfigAxios>(
      `${env.PAYMENTS_MS_ENDPOINT}/tenant/config`,
      {
        tenantId: tenantData.id,
      },
    )

    if (!paymentConfig.data) {
      throw new AppError('Erro ao buscar configuração de pagamento', 500)
    }

    const response: IResponse = {
      id: tenantData.id,
      name: tenantData.name,
      domain: tenantData.domain,
      products: tenantData.products,
      status: tenantData.status || false,
      defaultUrl: tenantData.defaultUrl || '',
      theme: {
        logo: tenantData.theme.logo || '',
        favicon: tenantData.theme.favicon || '',
        primaryColor: tenantData.theme.primaryColor || '#000000',
        secondaryColor: tenantData.theme.secondaryColor || '#FFFFFF',
        backgroundColor: tenantData.theme.backgroundColor || '#F0F0F0',
      },
      paymentConfig: {
        minDeposit: paymentConfig.data.minDeposit,
        maxDeposit: paymentConfig.data.maxDeposit,
        depositFee: paymentConfig.data.depositFee,
        depositSuggestions: paymentConfig.data.depositSuggestions,
        minWithdraw: paymentConfig.data.minWithdraw,
        maxWithdraw: paymentConfig.data.maxWithdraw,
        maxAutoWithdraw: paymentConfig.data.maxAutoWithdraw,
        maxWithdrawPerDay: paymentConfig.data.maxWithdrawPerDay,
      },
    }

    return response
  }
}
