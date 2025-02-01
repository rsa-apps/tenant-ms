import { db } from './connection'
import { users } from '@/db/schema/users'
import { tenants } from './schema'

async function seed() {
  console.log('🌾Seeding started')

  const [tenant] = await db
    .insert(tenants)
    .values({
      name: 'localhost',
      domain: 'http://localhost:3000',
      document: '123456789',
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        name: 'localhost',
        domain: 'http://localhost:3000',
        document: '123456789',
      },
    })
    .returning()

  await db
    .insert(users)
    .values({
      tenantId: tenant.id,
      username: 'admin',
      email: 'tenant@mail.com',
      password: 'admin',
    })
    .onConflictDoUpdate({
      target: users.id,
      set: { username: 'admin', email: 'tenant@mail.com', password: 'admin' },
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
