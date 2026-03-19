import { Pool } from 'pg';

const urls = [
  // Transaction mode pooler (port 6543)
  'postgresql://postgres.qytsilajkulywydolzpj:MarketShow2024@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.qytsilajkulywydolzpj:MarketShow2024@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.qytsilajkulywydolzpj:MarketShow2024@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  // Session mode pooler (port 5432)  
  'postgresql://postgres.qytsilajkulywydolzpj:MarketShow2024@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  // Direct connection (works only with IPv6)
  'postgresql://postgres:MarketShow2024@db.qytsilajkulywydolzpj.supabase.co:5432/postgres',
];

async function testUrl(url: string) {
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 as test');
    client.release();
    await pool.end();
    return { success: true, url: url.replace(/:[^:@]+@/, ':****@') };
  } catch (err: any) {
    await pool.end();
    return { success: false, url: url.replace(/:[^:@]+@/, ':****@'), error: err.message };
  }
}

async function main() {
  console.log('Testing connection URLs...\n');
  for (const url of urls) {
    const result = await testUrl(url);
    console.log(`${result.success ? '✅' : '❌'} ${result.url}`);
    if (!result.success) {
      console.log(`   Error: ${result.error?.substring(0, 100)}`);
    }
  }
}
main();
