import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@pntacademy.com' },
    update: { passwordHash: hashedPassword },
    create: {
      email: 'admin@pntacademy.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  
  console.log('Admin user injected successfully:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
