require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('@Nosliw74', 10);
  const user = await prisma.user.upsert({
    where: { email: 'wilsonglopes@gmail.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN'
    },
    create: {
      email: 'wilsonglopes@gmail.com',
      name: 'Wilson Lopes', 
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin criado com sucesso:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
