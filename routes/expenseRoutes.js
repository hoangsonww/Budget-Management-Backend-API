const express = require('express');
const { addExpense, getAllExpenses, getExpensesByBudget, updateExpenseById, deleteExpenseById } = require('../controllers/expenseController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, addExpense);
router.get('/', authenticate, getAllExpenses);
router.get('/:budgetId', authenticate, getExpensesByBudget);
router.put('/:id', authenticate, updateExpenseById);
router.delete('/:id', authenticate, deleteExpenseById);

module.exports = router;
