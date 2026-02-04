#!/usr/bin/env node
require('dotenv').config();

const pool = require('../services/postgresService');
const { faker } = require('@faker-js/faker');

const args = process.argv.slice(2);
const force = args.includes('--force');
const countArg = args.find(arg => arg.startsWith('--count='));
const parsedCount = countArg ? Number.parseInt(countArg.split('=')[1], 10) : 3000;
const totalCount = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 3000;
const batchSize = 200;

const seedTransactions = async () => {
  await pool.ensureTransactionLogsTable();

  if (force) {
    await pool.query('TRUNCATE transaction_logs RESTART IDENTITY;');
  }

  const existing = await pool.query('SELECT COUNT(*) FROM transaction_logs;');
  const existingCount = Number.parseInt(existing.rows[0].count, 10);

  if (existingCount > 0 && !force) {
    console.log(`transaction_logs already has ${existingCount} rows. Use --force to reseed.`);
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

seedTransactions()
  .catch(error => {
    console.error('PostgreSQL setup failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
