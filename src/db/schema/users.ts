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
  name: text('name').notNull(),
  email: text('email').notNull(),
  username: text('username'),
  phoneNumber: text('phone_number'),
  vatCode: text('vat_code'),
  status: boolean('status').notNull().default(true),
  role: text('role').array().default(['PUNTER']),
  password: text('password').notNull(),
  birthDate: timestamp('birth_date').notNull(),
  invitedBy: text('invited_by'),
  affiliationId: text('affiliation_id'),
  ...timestamps,
})

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  invitation: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
  affiliationConfig: one(affiliationConfig, {
    fields: [users.affiliationId],
    references: [affiliationConfig.id],
  }),
  userTokens: one(userTokens, {
    fields: [users.id],
    references: [userTokens.userId],
  }),
}))

export const wallets = pgTable('wallets', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  credits: integer('credits').default(0),
  bonus: integer('bonus').default(0),
  totalDeposited: integer('total_deposited').default(0),
  qtyDeposits: integer('qty_deposits').default(0),
  totalWithdrawn: integer('total_withdrawn').default(0),
  qtyWithdraws: integer('qty_withdraws').default(0),
  ...timestamps,
})

export const walletRelations = relations(wallets, ({ one }) => ({
  user: one(users, { fields: [wallets.userId], references: [users.id] }),
}))

export const affiliationConfig = pgTable('affiliate_info', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  managerCommission: integer('manager_commission').notNull().default(0),
  affiliateComission: integer('commision').notNull().default(0),
})

export const affiliationConfigRelations = relations(
  affiliationConfig,
  ({ one }) => ({
    user: one(users, {
      fields: [affiliationConfig.userId],
      references: [users.id],
    }),
  }),
)

export const userTokens = pgTable('user_token', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
})

export const userTokenRelations = relations(userTokens, ({ one }) => ({
  user: one(users, { fields: [userTokens.id], references: [users.id] }),
}))
