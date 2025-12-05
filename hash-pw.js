const bcrypt = require('bcryptjs');

const adminPassword = 'AdminPass2024!';
const studentPassword = 'StudentPass2024!';

const adminHash = bcrypt.hashSync(adminPassword, 10);
const studentHash = bcrypt.hashSync(studentPassword, 10);

console.log('Admin hash:', adminHash);
console.log('Student hash:', studentHash);
