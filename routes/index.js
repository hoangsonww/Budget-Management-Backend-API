const express = require('express');
const orderRoutes = require('./orderRoutes');
const customerRoutes = require('./customerRoutes');
const taskRoutes = require('./taskRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const budgetRoutes = require('./budgetRoutes');
const expenseRoutes = require('./expenseRoutes');
const graphqlRoutes = require('./graphqlRoutes');
const notificationRoutes = require('./notificationRoutes');
const searchRoutes = require('./searchRoutes');
const transactionRoutes = require('./transactionRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/budgets', budgetRoutes);
router.use('/expenses', expenseRoutes);
router.use('/graphql', graphqlRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationRoutes);
router.use('/transactions', transactionRoutes);
router.use('/', healthRoutes);

module.exports = router;
