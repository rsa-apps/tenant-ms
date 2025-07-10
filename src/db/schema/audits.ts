import { createId } from '@paralleldrive/cuid2'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { timestamps } from './columns.helpers'
import { users } from './users'

export const audits = pgTable('audits', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  action: text('action').notNull(),
  description: text('description').notNull(),
  responsibleId: text('responsible').notNull(),
  affectedId: text('affected').notNull(),
  ...timestamps,
})

export const auditRelations = relations(audits, ({ one }) => ({
  users: one(users, {
    fields: [audits.responsibleId, audits.affectedId],
    references: [users.id, users.id],
  }),
}))
