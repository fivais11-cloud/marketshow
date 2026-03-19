import { Pool } from 'pg';

const urls = [
  // Try without project-ref in username
  'postgresql://postgres:MarketShow2024@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres:MarketShow2024@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres:MarketShow2024@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  // Try different username formats
  'postgresql://qytsilajkulywydolzpj:MarketShow2024@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  // Try supabase pooler domain format
  'postgresql://postgres.qytsilajkulywydolzpj:MarketShow2024@supabase.com:6543/postgres',
];

async function testUrl(url: string) {
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 });
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
  console.log('Testing alternative connection URLs...\n');
  for (const url of urls) {
    const result = await testUrl(url);
    console.log(`${result.success ? '✅' : '❌'} ${result.url}`);
    if (!result.success) {
      console.log(`   Error: ${result.error?.substring(0, 100)}`);
    }
  }
}
main();
