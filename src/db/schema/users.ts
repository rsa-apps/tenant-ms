import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'
import { timestamps } from './columns.helpers'
import { relations } from 'drizzle-orm'
import { tenants } from './tenants'

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  tenantId: text('tenant_id').notNull(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  name: text('name'),
  document: text('document'),
  wallet: integer('wallet').notNull().default(0),
  birthDate: timestamp('birth_date'),
  invitedBy: text('invited_by'),
  affiliateInfoId: text('affiliate_id'),
  ...timestamps,
})

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
  affiliateInfo: one(affiliateInfo),
  userConfig: one(userConfig),
  userTokens: one(userTokens),
}))

export const affiliateInfo = pgTable('affiliate_info', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  managerCommission: integer('manager_commission').notNull().default(0),
  affiliateComission: integer('commision').notNull().default(0),
})

export const affiliateInfoRelations = relations(affiliateInfo, ({ one }) => ({
  user: one(users, { fields: [affiliateInfo.userId], references: [users.id] }),
}))

export const userConfig = pgTable('user_config', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  role: text('role').notNull().default('punter'),
  status: boolean('status').notNull().default(true),
})

export const userConfigRelations = relations(userConfig, ({ one }) => ({
  user: one(users, { fields: [userConfig.userId], references: [users.id] }),
}))

export const userTokens = pgTable('user_token', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
})

export const userTokenRelations = relations(userConfig, ({ one }) => ({
  user: one(users, { fields: [userConfig.userId], references: [users.id] }),
}))
