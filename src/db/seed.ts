import { db } from './connection'

import { tenants, theme, users, wallets } from './schema'

async function seed() {
  console.log('🌾Seeding started')

  // await db.delete(tenantConfigs).execute()
  // await db.delete(tenantPaymentConfig).execute()
  // await db.delete(tenants).execute()
  // await db.delete(users).execute()
  // await db.delete(wallets).execute()
  // await db.delete(userConfig).execute()
  // await db.delete(affiliateInfo).execute()

  await db.transaction(async (tx) => {
    const [tenant] = await tx
      .insert(tenants)
      .values({
        name: 'localhost',
        domain: 'http://localhost:3000',
      })
      .onConflictDoNothing()
      .returning()

    if (!tenant) {
      console.log('Tenant already exists, skipping tenant seeding')

      return
    }

    await tx
      .insert(theme)
      .values({
        tenantId: tenant.id,
      })
      .onConflictDoNothing()

    const passwordHash = await Bun.password.hash('!Admin123')

    const [user] = await tx
      .insert(users)
      .values({
        tenantId: tenant.id,
        username: 'adminmaster',
        email: 'tenant@mail.com',
        password: passwordHash,
      })
      .returning()

    if (!user) {
      console.log('User already exists, skipping user seeding')
      return
    }

    await tx
      .insert(wallets)
      .values({
        userId: user.id,
      })
      .onConflictDoNothing()
  })
}

seed()
  .then(() => {
    console.log('🌾Seeding completed')

    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
