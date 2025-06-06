import { createId } from '@paralleldrive/cuid2'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { timestamps } from './columns.helpers'

export const clients = pgTable('clients', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  ...timestamps,
})
