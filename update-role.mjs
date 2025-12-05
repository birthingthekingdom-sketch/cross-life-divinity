import { getDb } from './server/db.js';
import { users } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

const db = await getDb();
const result = await db.update(users)
  .set({ role: 'admin' })
  .where(eq(users.email, 'birthingthekingdom@gmail.com'));

console.log('Update result:', result);

// Verify
const user = await db.select().from(users).where(eq(users.email, 'birthingthekingdom@gmail.com'));
console.log('User role now:', user[0]?.role);
process.exit(0);
