import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core'
import { users } from './users'
import { timestamps } from './columns.helpers'

export const tenants = pgTable('tenants', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').notNull().unique(),
  ...timestamps,
})

export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  users: many(users),
  tenantConfigs: one(tenantConfigs),
}))

export const tenantConfigs = pgTable('tenant_configs', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  tenantId: text('tenant_id').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  sportbookStatus: boolean('sportbook_status').notNull().default(false),
  casinoStatus: boolean('casino_status').notNull().default(true),
  lotteriesStatus: boolean('lotteries_status').notNull().default(false),
  defaultPage: text('default_page').notNull().default('/app/casino'),
  webhookUrl: text('webhook_url'),
  ...timestamps,
})

export const tenantConfigsRelations = relations(tenantConfigs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantConfigs.tenantId],
    references: [tenants.id],
  }),
}))

export const tenantPaymentConfig = pgTable('tenant_payment_configs', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  tenantId: text('tenant_id').notNull(),
  minDeposit: integer('min_deposit').default(1),
  minWithdraw: integer('min_withdraw').default(1),
  maxWithdraw: integer('max_withdraw').default(10000),
  maxQtyWithdraw: integer('max_qty_withdraw').default(0),
  ...timestamps,
})
