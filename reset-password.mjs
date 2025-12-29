import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './server/db.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

const email = 'birthingthekingdom@gmail.com';
const newPassword = 'TempAdmin2024!';

const hashedPassword = await bcrypt.hash(newPassword, 10);

await db.update(users)
  .set({ password: hashedPassword })
  .where(eq(users.email, email));

console.log(`Password reset successfully for ${email}`);
console.log(`New password: ${newPassword}`);

await client.end();
