const Expense = require('../models/expense');
const Budget = require('../models/budget');
const redisClient = require('../services/redisService');
const mongoose = require('mongoose');
const esClient = require('../services/elasticService');

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: API for managing expenses
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Add a new expense to a budget
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - budgetId
 *               - description
 *               - amount
 *             properties:
 *               budgetId:
 *                 type: string
 *                 description: The ID of the budget to which the expense belongs.
 *               description:
 *                 type: string
 *                 description: The description of the expense.
 *               amount:
 *                 type: number
 *                 description: The amount of the expense.
 *     responses:
 *       201:
 *         description: Expense added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense added
 *                 expense:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c9b5f4e7a7d2b001e76a1b
 *                     budgetId:
 *                       type: string
 *                       example: 64c9f8f2a73c2f001b3c68f4
 *                     description:
 *                       type: string
 *                       example: Flight tickets
 *                     amount:
 *                       type: number
 *                       example: 500
 *       404:
 *         description: Budget not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Budget not found
 *       500:
 *         description: Server error.
 */
exports.addExpense = async (req, res, next) => {
  const { budgetId, description, amount } = req.body;

  try {
    // Validate budgetId format
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ error: 'Invalid budget ID format' });
    }

    // Ensure the budget exists
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Check if the Elasticsearch index exists
    const indexExists = await esClient.indices.exists({ index: 'expenses' });
    if (!indexExists) {
      // Check if the index does NOT exist
      console.log('Creating Elasticsearch index with correct mapping...');
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
              budgetId: {
                type: 'keyword',
              },
              amount: {
                type: 'float',
              },
              createdAt: {
                type: 'date',
              },
            },
          },
        },
      });
      console.log('Elasticsearch index created successfully.');
    }

    // Create expense in MongoDB
    const expense = new Expense({ budgetId, description, amount });
    const savedExpense = await expense.save();

    // Sync expense to Elasticsearch
    await esClient.index({
      index: 'expenses',
      id: savedExpense._id.toString(), // Use MongoDB's _id as the Elasticsearch document ID
      body: {
        budgetId: savedExpense.budgetId,
        description: savedExpense.description,
        amount: savedExpense.amount,
        createdAt: savedExpense.createdAt,
      },
    });

    console.log(`Indexed document in Elasticsearch: ${savedExpense._id}`);

    // Update Redis cache for the budget
    const cachedBudget = await redisClient.get(`budget:${budgetId}`);
    if (cachedBudget) {
      const parsedBudget = JSON.parse(cachedBudget);
      parsedBudget.expenses = parsedBudget.expenses || [];
      parsedBudget.expenses.push(savedExpense);
      await redisClient.set(`budget:${budgetId}`, JSON.stringify(parsedBudget));
    }

    res.status(201).json({ message: 'Expense added', expense: savedExpense });
  } catch (error) {
    console.error('Error adding expense:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }

    // General server error
    res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
  }
};

/**
 * @swagger
 * /api/expenses/{budgetId}:
 *   get:
 *     summary: Retrieve all expenses for a specific budget
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to retrieve expenses for.
 *     responses:
 *       200:
 *         description: List of expenses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expenses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64c9b5f4e7a7d2b001e76a1b
 *                       budgetId:
 *                         type: string
 *                         example: 64c9f8f2a73c2f001b3c68f4
 *                       description:
 *                         type: string
 *                         example: Flight tickets
 *                       amount:
 *                         type: number
 *                         example: 500
 *                 source:
 *                   type: string
 *                   example: cache
 *       404:
 *         description: No expenses found for this budget.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No expenses found for this budget
 *       500:
 *         description: Server error.
 */
exports.getExpensesByBudget = async (req, res, next) => {
  const { budgetId } = req.params;

  try {
    // Check cache first
    const cachedExpenses = await redisClient.get(`expenses:${budgetId}`);
    if (cachedExpenses) {
      return res.status(200).json({ expenses: JSON.parse(cachedExpenses), source: 'cache' });
    }

    // Fetch expenses from MongoDB if not cached
    const expenses = await Expense.find({ budgetId });
    if (!expenses.length) return res.status(404).json({ error: 'No expenses found for this budget' });

    // Cache expenses in Redis
    await redisClient.set(`expenses:${budgetId}`, JSON.stringify(expenses));

    res.status(200).json({ expenses, source: 'database' });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense to delete.
 *     responses:
 *       200:
 *         description: Expense deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense deleted successfully
 *       404:
 *         description: Expense not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Expense not found
 *       500:
 *         description: Server error.
 */
exports.deleteExpenseById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid expense ID format' });
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Remove from Elasticsearch
    await esClient.delete({ index: 'expenses', id });

    // Remove from Redis cache if applicable
    const cachedBudget = await redisClient.get(`expenses:${expense.budgetId}`);
    if (cachedBudget) {
      const expenses = JSON.parse(cachedBudget).filter(exp => exp._id !== id);
      await redisClient.set(`expenses:${expense.budgetId}`, JSON.stringify(expenses));
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    next(error);
  }
};

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the expense to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The new description of the expense.
 *               amount:
 *                 type: number
 *                 description: The new amount of the expense.
 *     responses:
 *       200:
 *         description: Expense updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense updated successfully
 *                 expense:
 *                   type: object
 *       404:
 *         description: Expense not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Expense not found
 *       500:
 *         description: Server error.
 */
exports.updateExpenseById = async (req, res, next) => {
  const { id } = req.params;
  const { description, amount } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid expense ID format' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(id, { description, amount }, { new: true, runValidators: true });

    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Update Elasticsearch
    await esClient.update({
      index: 'expenses',
      id,
      doc: {
        description: updatedExpense.description,
        amount: updatedExpense.amount,
      },
    });

    // Update Redis cache if applicable
    const cachedBudget = await redisClient.get(`expenses:${updatedExpense.budgetId}`);
    if (cachedBudget) {
      const expenses = JSON.parse(cachedBudget).map(exp => (exp._id === id ? updatedExpense : exp));
      await redisClient.set(`expenses:${updatedExpense.budgetId}`, JSON.stringify(expenses));
    }

    res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    next(error);
  }
};

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Retrieve all expenses across all budgets
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: List of all expenses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64c9b5f4e7a7d2b001e76a1b
 *                   budgetId:
 *                     type: string
 *                     example: 64c9f8f2a73c2f001b3c68f4
 *                   description:
 *                     type: string
 *                     example: "Flight tickets"
 *                   amount:
 *                     type: number
 *                     example: 500
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T12:34:56.789Z"
 *                 source:
 *                   type: string
 *                   example: cache
 *       500:
 *         description: Server error.
 */
exports.getAllExpenses = async (req, res, next) => {
  try {
    // Check Redis cache first
    const cachedExpenses = await redisClient.get('expenses:all');
    if (cachedExpenses) {
      return res.status(200).json({ expenses: JSON.parse(cachedExpenses), source: 'cache' });
    }

    // Fetch from MongoDB if not cached
    const expenses = await Expense.find();
    if (!expenses.length) return res.status(404).json({ error: 'No expenses found' });

    // Cache the results in Redis
    await redisClient.set('expenses:all', JSON.stringify(expenses), { EX: 3600 }); // Cache for 1 hour

    res.status(200).json({ expenses, source: 'database' });
  } catch (error) {
    console.error('Error retrieving all expenses:', error);
    next(error);
  }
};
