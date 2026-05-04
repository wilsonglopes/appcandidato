const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ 
  connectionString: 'postgresql://postgres.tkokztokfjfguwonkuwh:YJps3fUX1u4Y43g2@aws-1-sa-east-1.pooler.supabase.com:5432/postgres' 
});

async function create() {
  const hash = await bcrypt.hash('@Nosliw74', 10);
  const id = 'cm' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  
  await pool.query(
    `INSERT INTO "User" (id, name, email, password, role, "updatedAt") 
     VALUES ($1, $2, $3, $4, 'ADMIN', NOW()) 
     ON CONFLICT (email) DO UPDATE SET password = $4, role = 'ADMIN'`,
    [id, 'Wilson Lopes', 'wilsonglopes@gmail.com', hash]
  );
  
  console.log('User created successfully!');
  process.exit(0);
}

create().catch(err => {
  console.error(err);
  process.exit(1);
});
