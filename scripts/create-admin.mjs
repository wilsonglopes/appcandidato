import bcrypt from 'bcryptjs';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('@Nosliw74', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'wilsonglopes@gmail.com' },
    update: { password: hash, role: 'ADMIN', name: 'Wilson Lopes' },
    create: {
      email: 'wilsonglopes@gmail.com',
      name: 'Wilson Lopes',
      password: hash,
      role: 'ADMIN',
    },
  });
  
  console.log('Admin criado com sucesso:', user.email, '| Role:', user.role);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
