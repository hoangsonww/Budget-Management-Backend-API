const pool = require('../services/postgresService');

const ensureTransactionLogsTable = () => (typeof pool.ensureTransactionLogsTable === 'function' ? pool.ensureTransactionLogsTable() : Promise.resolve());

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing transaction logs
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Add a new transaction log
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - description
 *               - amount
 *               - budgetId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user associated with the transaction.
 *               description:
 *                 type: string
 *                 description: A description of the transaction.
 *               amount:
 *                 type: number
 *                 description: The amount of the transaction.
 *               budgetId:
 *                 type: string
 *                 description: The ID of the budget associated with the transaction.
 *     responses:
 *       201:
 *         description: Transaction log added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction log added"
 *                 transaction:
 *                   type: object
 *       500:
 *         description: Server error.
 */
exports.addTransactionLog = async (req, res, next) => {
  const { userId, description, amount, budgetId } = req.body;

  try {
    await ensureTransactionLogsTable();
    const query = `
        INSERT INTO transaction_logs (user_id, description, amount, budget_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;

    const values = [userId, description, amount, budgetId];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Transaction log added', transaction: result.rows[0] });
  } catch (error) {
    console.error('Error adding transaction log:', error.message);
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve all transaction logs
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of all transaction logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error.
 */
exports.getAllTransactionLogs = async (req, res, next) => {
  try {
    await ensureTransactionLogsTable();
    const result = await pool.query('SELECT * FROM transaction_logs ORDER BY created_at DESC;');

    res.status(200).json({ logs: result.rows });
  } catch (error) {
    console.error('Error fetching transaction logs:', error.message);
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/user/{userId}:
 *   get:
 *     summary: Retrieve transaction logs by user ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve transaction logs for.
 *     responses:
 *       200:
 *         description: List of transaction logs for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error.
 */
exports.getTransactionLogsByUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await ensureTransactionLogsTable();
    const query = 'SELECT * FROM transaction_logs WHERE user_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(query, [userId]);

    res.status(200).json({ logs: result.rows });
  } catch (error) {
    console.error('Error fetching user transaction logs:', error.message);
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction log by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to delete.
 *     responses:
 *       200:
 *         description: Transaction deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction deleted successfully"
 *       404:
 *         description: Transaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Server error.
 */
exports.deleteTransactionLog = async (req, res, next) => {
  const { id } = req.params;

  try {
    await ensureTransactionLogsTable();
    const query = 'DELETE FROM transaction_logs WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction log:', error.message);
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction log by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Updated description of the transaction.
 *               amount:
 *                 type: number
 *                 description: Updated amount of the transaction.
 *               budgetId:
 *                 type: string
 *                 description: Updated budget ID associated with the transaction.
 *     responses:
 *       200:
 *         description: Transaction updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction updated successfully"
 *                 transaction:
 *                   type: object
 *       404:
 *         description: Transaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Server error.
 */
exports.updateTransactionLog = async (req, res, next) => {
  const { id } = req.params;
  const { description, amount, budgetId } = req.body;

  try {
    await ensureTransactionLogsTable();
    const query = `
      UPDATE transaction_logs
      SET description = $1, amount = $2, budget_id = $3
      WHERE id = $4
      RETURNING *;
    `;

    const values = [description, amount, budgetId, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction updated successfully', transaction: result.rows[0] });
  } catch (error) {
    console.error('Error updating transaction log:', error.message);
    next(error);
  }
};
