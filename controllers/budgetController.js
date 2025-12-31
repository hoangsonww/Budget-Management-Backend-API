const Budget = require('../models/budget');
const redisClient = require('../services/redisService');
const mongoose = require('mongoose');
const { publishEvent } = require('../apache-kafka/kafkaService');

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Budget Management API
 */

/**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - limit
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the budget.
 *               limit:
 *                 type: number
 *                 description: The spending limit of the budget.
 *     responses:
 *       201:
 *         description: Budget created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Budget created
 *                 budget:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c9b5f4e7a7d2b001e76a1b
 *                     name:
 *                       type: string
 *                       example: Travel
 *                     limit:
 *                       type: number
 *                       example: 2000
 *       500:
 *         description: Server error.
 */
exports.createBudget = async (req, res, next) => {
  try {
    const { name, limit } = req.body;
    const budget = new Budget({ name, limit });
    const savedBudget = await budget.save();

    // Cache the budget in Redis
    await redisClient.set(`budget:${savedBudget._id}`, JSON.stringify(savedBudget));

    await publishEvent(
      'budget-events',
      'budget.created',
      {
        budgetId: savedBudget._id.toString(),
        name: savedBudget.name,
        limit: savedBudget.limit,
      },
      { key: savedBudget._id.toString(), source: 'budget-controller' }
    );

    res.status(201).json({ message: 'Budget created', budget: savedBudget });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to retrieve.
 *     responses:
 *       200:
 *         description: Budget retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 budget:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c9b5f4e7a7d2b001e76a1b
 *                     name:
 *                       type: string
 *                       example: Travel
 *                     limit:
 *                       type: number
 *                       example: 2000
 *                 source:
 *                   type: string
 *                   example: cache
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
exports.getBudget = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check cache first
    const cachedBudget = await redisClient.get(`budget:${id}`);
    if (cachedBudget) {
      return res.status(200).json({ budget: JSON.parse(cachedBudget), source: 'cache' });
    }

    // Fetch from MongoDB if not in cache
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });

    // Cache the budget in Redis
    await redisClient.set(`budget:${id}`, JSON.stringify(budget));

    res.status(200).json({ budget, source: 'database' });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all budgets
 *     tags: [Budgets]
 *     responses:
 *       200:
 *         description: List of all budgets.
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
 *                   name:
 *                     type: string
 *                     example: Travel
 *                   limit:
 *                     type: number
 *                     example: 2000
 *       500:
 *         description: Server error.
 */
exports.getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/budgets/{id}:
 *   delete:
 *     summary: Delete a budget by ID
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to delete.
 *     responses:
 *       200:
 *         description: Budget deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Budget deleted successfully.
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
exports.deleteBudget = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Attempt to delete the budget
    const deletedBudget = await Budget.findByIdAndDelete(id);
    if (!deletedBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Remove from Redis cache
    await redisClient.del(`budget:${id}`);

    await publishEvent(
      'budget-events',
      'budget.deleted',
      { budgetId: id, name: deletedBudget.name, limit: deletedBudget.limit },
      { key: id, source: 'budget-controller' }
    );

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     summary: Update a budget by ID
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the budget.
 *                 example: "Updated Travel Budget"
 *               limit:
 *                 type: number
 *                 description: The updated spending limit of the budget.
 *                 example: 2500
 *     responses:
 *       200:
 *         description: Budget updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Budget updated successfully.
 *                 budget:
 *                   type: object
 *       400:
 *         description: Validation error or invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error.
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Limit must be a number."
 *       404:
 *         description: Budget not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Budget not found.
 *       500:
 *         description: Server error.
 */
exports.updateBudget = async (req, res, next) => {
  const { id } = req.params;
  const { name, limit } = req.body;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid budget ID format' });
    }

    // Update the budget
    const updatedBudget = await Budget.findByIdAndUpdate(id, { name, limit }, { new: true, runValidators: true });

    if (!updatedBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Update Redis cache
    await redisClient.set(`budget:${id}`, JSON.stringify(updatedBudget));

    await publishEvent(
      'budget-events',
      'budget.updated',
      {
        budgetId: updatedBudget._id.toString(),
        name: updatedBudget.name,
        limit: updatedBudget.limit,
      },
      { key: updatedBudget._id.toString(), source: 'budget-controller' }
    );

    res.status(200).json({ message: 'Budget updated successfully', budget: updatedBudget });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message),
      });
    }

    console.error('Error updating budget:', error);
    next(error);
  }
};
