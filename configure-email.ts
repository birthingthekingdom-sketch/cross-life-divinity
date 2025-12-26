import { setEmailConfig } from './server/email';

// Configure Gmail SMTP settings
setEmailConfig({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'birthingthekingdom@gmail.com',
  pass: 'fvvjbelgfwoamlub', // Gmail App Password (spaces removed)
});

console.log('✅ Email configuration updated successfully!');
console.log('');
console.log('Email Settings:');
console.log('  Host: smtp.gmail.com');
console.log('  Port: 587');
console.log('  Email: birthingthekingdom@gmail.com');
console.log('');
console.log('Your site will now send automated emails for:');
console.log('  - Payment receipts');
console.log('  - Enrollment confirmations');
console.log('  - Monthly payment reminders');
console.log('  - Payment plan completion notices');
