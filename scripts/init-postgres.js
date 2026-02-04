#!/usr/bin/env node
require('dotenv').config();

// Allow connecting to managed DBs with self-signed chains when sslmode=require is used.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const args = process.argv.slice(2);
const dbArg = args.find(arg => arg.startsWith('--db='));
const adminArg = args.find(arg => arg.startsWith('--admin-db='));
const countArg = args.find(arg => arg.startsWith('--count='));
const force = args.includes('--force');
const noSeed = args.includes('--no-seed');

const rawUrl = process.env.POSTGRES_URL;
if (!rawUrl) {
  console.error('POSTGRES_URL is not set.');
  process.exit(1);
}

const baseUrl = new URL(rawUrl);
const targetDb = (dbArg ? dbArg.split('=')[1] : baseUrl.pathname.replace('/', '')) || 'budgets';
const adminDb = adminArg ? adminArg.split('=')[1] : 'defaultdb';
const parsedCount = countArg ? Number.parseInt(countArg.split('=')[1], 10) : 3000;
const totalCount = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 3000;
const batchSize = 200;

const validDbName = /^[a-zA-Z0-9_]+$/;
if (!validDbName.test(targetDb) || !validDbName.test(adminDb)) {
  console.error('Database name must be alphanumeric/underscore only.');
  process.exit(1);
}

const sslMode = (baseUrl.searchParams.get('sslmode') || '').toLowerCase();
const sslRequired = ['require', 'verify-ca', 'verify-full'].includes(sslMode) || process.env.PGSSLMODE === 'require' || process.env.POSTGRES_SSL === 'true';

const ssl = sslRequired ? { rejectUnauthorized: false } : undefined;

const buildUrl = dbName => {
  const url = new URL(rawUrl);
  url.pathname = `/${dbName}`;
  return url.toString();
};

const ensureDatabase = async () => {
  const adminPool = new Pool({
    connectionString: buildUrl(adminDb),
    ssl,
  });

  try {
    const exists = await adminPool.query('SELECT 1 FROM pg_database WHERE datname = $1;', [targetDb]);
    if (exists.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE "${targetDb}";`);
      console.log(`Created database "${targetDb}".`);
    } else {
      console.log(`Database "${targetDb}" already exists.`);
    }
  } finally {
    await adminPool.end();
  }
};

const ensureTables = async pool => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transaction_logs (
      id BIGSERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      budget_id VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_transaction_logs_user_id ON transaction_logs(user_id);');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_transaction_logs_created_at ON transaction_logs(created_at);');
};

const seedTransactions = async pool => {
  const existing = await pool.query('SELECT COUNT(*) FROM transaction_logs;');
  const existingCount = Number.parseInt(existing.rows[0].count, 10);

  if (existingCount > 0 && !force) {
    console.log(`transaction_logs already has ${existingCount} rows. Use --force to reseed.`);
    return;
  }

  if (force) {
    await pool.query('TRUNCATE transaction_logs RESTART IDENTITY;');
  }

  if (noSeed) {
    console.log('Skipping seed due to --no-seed.');
    return;
  }

  console.log(`Seeding ${totalCount} transaction logs...`);

  let inserted = 0;
  while (inserted < totalCount) {
    const batchCount = Math.min(batchSize, totalCount - inserted);
    const values = [];
    const placeholders = [];

    for (let i = 0; i < batchCount; i++) {
      const seq = inserted + i + 1;
      const userId = `user${Math.ceil(seq / 10)}`;
      const budgetId = `budget${Math.ceil(seq / 20)}`;
      const description = `Transaction ${seq}: ${faker.finance.transactionDescription()}`;
      const amount = Number.parseFloat((Math.random() * 5000).toFixed(2));

      values.push(userId, description, amount, budgetId);
      const base = i * 4;
      placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
    }

    const query = `
      INSERT INTO transaction_logs (user_id, description, amount, budget_id)
      VALUES ${placeholders.join(', ')};
    `;
    await pool.query(query, values);
    inserted += batchCount;
  }

  console.log('PostgreSQL transaction logs seeded.');
};

const main = async () => {
  await ensureDatabase();

  const pool = new Pool({
    connectionString: buildUrl(targetDb),
    ssl,
  });

  try {
    await ensureTables(pool);
    await seedTransactions(pool);
  } finally {
    await pool.end();
  }
};

main().catch(error => {
  console.error('PostgreSQL init failed:', error.message);
  process.exitCode = 1;
});
