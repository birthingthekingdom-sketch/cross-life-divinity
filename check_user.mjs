import { db } from './server/db.ts';

const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, 'teststudent@crosslife.test')
});

console.log('User found:', user ? 'YES' : 'NO');
if (user) {
  console.log('User ID:', user.id);
  console.log('User email:', user.email);
  console.log('User name:', user.name);
}
