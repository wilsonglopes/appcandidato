require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  const email = 'wilsonglopes@gmail.com';
  const password = '@Nosliw74';
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('Usuário não encontrado!');
    return;
  }
  
  const match = await bcrypt.compare(password, user.password);
  console.log(`Verificando senha para ${email}:`);
  console.log(`Hash no banco: ${user.password}`);
  console.log(`Resultado do match: ${match}`);
}

verify()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
