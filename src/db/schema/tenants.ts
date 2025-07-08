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
  domain: text('domain').notNull().unique(),
  status: boolean('status').notNull().default(true),
  defaultUrl: text('default_url').notNull().default('/app/lotteries'),
  webhookUrl: text('webhook_url'),
  products: text('products').array(),
  ...timestamps,
})

export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  users: many(users),
  theme: one(theme),
}))

export const theme = pgTable('theme', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  logo: text('logo').default(
    'https://rsa.bet/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frsa-logo.f7e387d5.png&w=256&q=75',
  ),
  favicon: text('favicon').default(
    'https://rsa.bet/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frsa-logo.f7e387d5.png&w=256&q=75',
  ),
  primaryColor: text('primary_color').default('#000000'),
  secondaryColor: text('secondary_color').default('#FFFFFF'),
  backgroundColor: text('background_color').default('#F0F0F0'),
  tenantId: text('tenant_id').notNull(),
  ...timestamps,
})

export const themeRelations = relations(theme, ({ one }) => ({
  tenant: one(tenants, {
    fields: [theme.tenantId],
    references: [tenants.id],
  }),
}))
