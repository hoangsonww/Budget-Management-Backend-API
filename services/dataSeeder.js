const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Budget = require('../models/budget');
const Expense = require('../models/expense');
const Task = require('../models/task');
const pool = require('../services/postgresService');
const esClient = require('../services/elasticService');
const { faker } = require('@faker-js/faker');

module.exports = async () => {
  try {
    console.log('Starting data seeding with realistic data...');

    const customersCount = await Customer.countDocuments();
    const budgetsCount = await Budget.countDocuments();
    const tasksCount = await Task.countDocuments();

    // -------------------- SEED CUSTOMERS & ORDERS --------------------
    if (customersCount === 0) {
      console.log('Seeding MongoDB customers and orders...');
      const numCustomers = 200;
      const sampleCustomers = [];
      for (let i = 0; i < numCustomers; i++) {
        sampleCustomers.push({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number('+1##########'),
        });
      }
      const customers = await Customer.insertMany(sampleCustomers);

      const sampleOrders = [];
      for (const customer of customers) {
        const ordersForCustomer = faker.number.int({ min: 5, max: 15 });
        for (let j = 0; j < ordersForCustomer; j++) {
          sampleOrders.push({
            customerId: customer._id,
            amount: parseFloat((Math.random() * 1000).toFixed(2)),
            status: faker.helpers.arrayElement(['pending', 'shipped', 'delivered', 'returned', 'canceled']),
          });
        }
      }
      await Order.insertMany(sampleOrders);
      console.log('Customers and orders seeded into MongoDB.');
    } else {
      console.log('Customers and orders already exist. Skipping...');
    }

    // -------------------- SEED BUDGETS & EXPENSES --------------------
    if (budgetsCount === 0) {
      console.log('Seeding MongoDB budgets and expenses...');

      // Different categories of budgets
      const budgetCategories = [
        'Household',
        'Groceries',
        'Travel',
        'Office Supplies',
        'Entertainment',
        'Utilities',
        'Health & Fitness',
        'Transportation',
        'Clothing',
        'Education',
        'Dining Out',
        'Home Improvement',
        'Subscription Services',
        'Gifts',
        'Insurance',
      ];

      const numBudgets = 50;
      const sampleBudgets = [];
      for (let i = 0; i < numBudgets; i++) {
        const category = faker.helpers.arrayElement(budgetCategories);
        sampleBudgets.push({
          name: `${category} Budget`,
          limit: faker.number.int({ min: 1000, max: 20000 }),
        });
      }
      const budgets = await Budget.insertMany(sampleBudgets);

      // Generate realistic expense descriptions
      const expenseDescriptions = [
        () => `Groceries at ${faker.company.name()}`,
        () => `Dinner at ${faker.company.name()} Restaurant`,
        () => `Online purchase: ${faker.commerce.productName()}`,
        () => `Monthly subscription: ${faker.company.name()}`,
        () => `Taxi ride with ${faker.company.name()}`,
        () => `Gym membership: ${faker.company.name()}`,
        () => `Utility bill: ${faker.company.name()}`,
        () => `Office supplies from ${faker.company.name()}`,
        () => `Movie tickets at ${faker.location.city()} Theater`,
        () => `Hotel stay in ${faker.location.city()}`,
        () => `Airline ticket - ${faker.airline.airline()}`,
        () => `Gift from ${faker.company.name()}`,
        () => `Electronics purchase: ${faker.commerce.productName()}`,
      ];

      const sampleExpenses = [];
      for (const budget of budgets) {
        const numberOfExpenses = faker.number.int({ min: 20, max: 50 });
        for (let j = 0; j < numberOfExpenses; j++) {
          const descriptionFunc = faker.helpers.arrayElement(expenseDescriptions);
          sampleExpenses.push({
            budgetId: budget._id,
            description: descriptionFunc(),
            amount: faker.number.int({ min: 50, max: Math.floor(budget.limit / 5) }),
          });
        }
      }
      const insertedExpenses = await Expense.insertMany(sampleExpenses);
      console.log(`Budgets and ${insertedExpenses.length} expenses seeded into MongoDB.`);

      // -------------------- INDEX EXPENSES IN ELASTICSEARCH --------------------
      console.log('Ensuring Elasticsearch "expenses" index exists...');
      const indexExists = await esClient.indices.exists({ index: 'expenses' });
      if (!indexExists) {
        console.log('Creating Elasticsearch index "expenses" with correct mapping...');
        await esClient.indices.create({
          index: 'expenses',
          body: {
            mappings: {
              properties: {
                description: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                    },
                  },
                },
                budgetId: { type: 'keyword' },
                amount: { type: 'float' },
                createdAt: { type: 'date' },
              },
            },
          },
        });
        console.log('Elasticsearch index "expenses" created successfully.');
      } else {
        console.log('Elasticsearch "expenses" index already exists.');
      }

      console.log('Bulk indexing all expenses into Elasticsearch...');
      const bulkOps = [];
      for (const exp of insertedExpenses) {
        bulkOps.push({ index: { _index: 'expenses', _id: exp._id.toString() } });
        bulkOps.push({
          budgetId: exp.budgetId.toString(),
          description: exp.description,
          amount: exp.amount,
          createdAt: exp.createdAt,
        });
      }

      if (bulkOps.length > 0) {
        const bulkResponse = await esClient.bulk({ body: bulkOps, refresh: true });
        if (bulkResponse.errors) {
          console.error('Errors occurred while bulk indexing expenses. Inspecting items...');
          for (const item of bulkResponse.items) {
            if (item.index && item.index.error) {
              console.error('Indexing error for doc:', item.index._id, item.index.error);
            }
          }
        } else {
          console.log('All expenses indexed into Elasticsearch successfully.');
        }
      }
    } else {
      console.log('Budgets and expenses already exist. Skipping...');
    }

    // -------------------- SEED TASKS --------------------
    if (tasksCount === 0) {
      console.log('Seeding MongoDB tasks...');
      const numTasks = 500;
      const sampleTasks = [];
      for (let i = 1; i <= numTasks; i++) {
        sampleTasks.push({
          description: `Task ${i}: ${faker.hacker.phrase()}`,
          status: faker.helpers.arrayElement(['completed', 'pending', 'in-progress', 'on-hold']),
        });
      }
      await Task.insertMany(sampleTasks);
      console.log('Tasks seeded into MongoDB.');
    } else {
      console.log('Tasks already exist. Skipping...');
    }

    // -------------------- SEED POSTGRES TRANSACTIONS --------------------
    console.log('Seeding PostgreSQL transactions...');
    const result = await pool.query('SELECT COUNT(*) FROM transaction_logs');
    const transactionsCount = parseInt(result.rows[0].count, 10);

    if (transactionsCount === 0) {
      const numTransactions = 3000;
      const seedTransactions = [];
      for (let i = 1; i <= numTransactions; i++) {
        seedTransactions.push({
          userId: `user${Math.ceil(i / 10)}`,
          description: `Transaction ${i}: ${faker.finance.transactionDescription()}`,
          amount: parseFloat((Math.random() * 5000).toFixed(2)),
          budgetId: `budget${Math.ceil(i / 20)}`,
        });
      }

      const query = `
          INSERT INTO transaction_logs (user_id, description, amount, budget_id)
          VALUES ($1, $2, $3, $4);
      `;

      for (const transaction of seedTransactions) {
        await pool.query(query, [transaction.userId, transaction.description, transaction.amount, transaction.budgetId]);
      }

      console.log('Transactions seeded into PostgreSQL.');
    } else {
      console.log('Transactions already exist in PostgreSQL. Skipping...');
    }

    console.log('Data seeding complete with realistic expense descriptions.');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};
