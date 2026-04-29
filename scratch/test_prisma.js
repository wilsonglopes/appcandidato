const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const events = await prisma.event.findMany();
    console.log("Eventos encontrados:", events.length);
  } catch (e) {
    console.error("Erro ao acessar prisma.event:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
