import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { AppError } from '@/domain/errors/AppError'
import { env } from '@/env'
import axios from 'axios'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'

interface IRequest {
  vatCode: string
}

interface IResponse {
  name: string
  birthDate: Date
  valid: boolean
}

interface AxiosResponse {
  nome: string
  nascimento: string
}

export async function verifyDocument({
  vatCode,
}: IRequest): Promise<IResponse> {
  const [user] = await db
    .select({
      name: users.name,
      birthDate: users.birthDate,
    })
    .from(users)
    .where(eq(users.vatCode, vatCode))

  if (user) {
    return {
      name: user.name,
      birthDate: user.birthDate,
      valid: true,
    }
  }

  const { data } = await axios
    .post<AxiosResponse>(
      `${env.CPF_CNPJ_API_URL}/${env.CPF_CNPJ_API_TOKEN}/${env.CPF_CNPJ_API_PACKAGE}/${vatCode}`,
    )
    .catch((error) => {
      console.error('Error fetching document data:', error.response.data)
      throw new AppError(error.response.data.erro)
    })

  // valid if data.nascimento > 18 anos
  // convert dd/mm/yyyy to Date
  const [dia, mes, ano] = data.nascimento.split('/').map(Number)

  // Lembrando que o mês no Date começa em 0 (janeiro) até 11 (dezembro)
  const birthDate = new Date(ano, mes - 1, dia)

  // Check if the user is at least 18 years old
  const today = new Date()
  const limitDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  )

  const valid = birthDate <= limitDate

  return {
    name: data.nome,
    birthDate: dayjs(birthDate).toDate(),
    valid,
  }
}
