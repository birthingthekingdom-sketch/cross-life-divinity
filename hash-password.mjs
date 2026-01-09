import bcrypt from 'bcryptjs';

const password = 'Myprime25!';
const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword);
