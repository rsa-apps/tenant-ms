import { sql, type AnyColumn } from 'drizzle-orm'

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`
}

const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`
}

export const dbFunctions = { increment, decrement }
