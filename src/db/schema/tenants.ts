import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { users } from './users'
import { timestamps } from './columns.helpers'

export const tenants = pgTable('tenants', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  document: text('document').notNull().unique(),
  domain: text('domain').notNull().unique(),
  ...timestamps,
})

export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  users: many(users),
  tenantConfigs: one(TenantConfigs),
}))

export const TenantConfigs = pgTable('tenant_configs', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  tenantId: text('tenant_id').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  sportbookStatus: boolean('sportbook_status').notNull().default(false),
  casinoStatus: boolean('casino_status').notNull().default(true),
  lotteriesStatus: boolean('lotteries_status').notNull().default(false),
  defaultPage: text('default_page').notNull().default('/casino'),
  webhookUrl: text('webhook_url'),
  ...timestamps,
})

export const tenantConfigsRelations = relations(TenantConfigs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [TenantConfigs.tenantId],
    references: [tenants.id],
  }),
}))
