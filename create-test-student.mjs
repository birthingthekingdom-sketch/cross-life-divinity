import { db } from './server/db.ts';
import { users } from './drizzle/schema.ts';
import bcrypt from 'bcryptjs';

async function createTestStudent() {
  try {
    const hashedPassword = await bcrypt.hash('TestStudent123!', 10);
    
    const result = await db.insert(users).values({
      name: 'Test Student',
      email: 'teststudent@crosslife.test',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✅ Test student created successfully!');
    console.log('Email: teststudent@crosslife.test');
    console.log('Password: TestStudent123!');
  } catch (error) {
    console.error('Error creating test student:', error);
  }
}

createTestStudent();
