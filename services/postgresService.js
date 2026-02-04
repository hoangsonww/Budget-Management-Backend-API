const { Pool } = require('pg');
const config = require('../config/config'); // Load configuration

const sslRequired = /sslmode=require/i.test(config.postgresUrl || '') || process.env.PGSSLMODE === 'require' || process.env.POSTGRES_SSL === 'true';

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: config.postgresUrl, // Load connection string from config
  ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', err => {
  console.error('PostgreSQL connection error:', err.message);
});

let ensureTransactionLogsTablePromise = null;

const ensureTransactionLogsTable = () => {
  if (!ensureTransactionLogsTablePromise) {
    ensureTransactionLogsTablePromise = (async () => {
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
    })().catch(error => {
      ensureTransactionLogsTablePromise = null;
      throw error;
    });
  }

  return ensureTransactionLogsTablePromise;
};

pool.ensureTransactionLogsTable = ensureTransactionLogsTable;

module.exports = pool;
