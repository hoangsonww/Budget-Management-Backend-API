const { sendToQueue } = require('../services/rabbitMQService');
const redisClient = require('../services/redisService');
const Task = require('../models/task');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API for task management using RabbitMQ and Redis
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Submit a task to RabbitMQ
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 description: The task description.
 *                 example: "Process user analytics"
 *     responses:
 *       202:
 *         description: Task submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task submitted successfully"
 *                 taskId:
 *                   type: string
 *                   example: "64c9f8f2a73c2f001b3c68f4"
 *       500:
 *         description: Server error.
 */
exports.sendTask = async (req, res, next) => {
  const { description } = req.body;

  try {
    // Create a new task in MongoDB
    const task = new Task({ description, status: 'pending' });
    const savedTask = await task.save();

    try {
      // Attempt to cache the task status in Redis
      await redisClient.set(`task:${savedTask._id}:status`, 'pending');
    } catch (redisError) {
      console.error('Redis operation failed:', redisError.message);
    }

    // Send the task to RabbitMQ queue
    sendToQueue('task_queue', JSON.stringify({ taskId: savedTask._id, description }));

    res.status(202).json({ message: 'Task submitted successfully', taskId: savedTask._id });
  } catch (error) {
    next(error); // Forward error to middleware
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Check the status of a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to check status.
 *     responses:
 *       200:
 *         description: Task status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   example: "64c9f8f2a73c2f001b3c68f4"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Server error.
 */
exports.checkTaskStatus = async (req, res, next) => {
  const { id } = req.params;

  try {
    console.log(`Checking status for task ID: ${id}`);

    // Fetch task status from Redis
    const redisKey = `task:${id}:status`;
    const status = await redisClient.get(redisKey);
    console.log(`Redis response for ${redisKey} -> ${status}`);

    if (!status) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ taskId: id, status });
  } catch (error) {
    console.error('Error fetching task status:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete.
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *                 taskId:
 *                   type: string
 *                   example: "64c9f8f2a73c2f001b3c68f4"
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Server error.
 */
exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    console.log(`Deleting task ID: ${id}`);

    // Delete the task from MongoDB
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete the task status from Redis
    const redisKey = `task:${id}:status`;
    await redisClient.del(redisKey);
    console.log(`Deleted Redis key: ${redisKey}`);

    res.status(200).json({ message: 'Task deleted successfully', taskId: id });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64c9f8f2a73c2f001b3c68f4"
 *                   description:
 *                     type: string
 *                     example: "Process user analytics"
 *                   status:
 *                     type: string
 *                     example: "completed"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T12:34:56.789Z"
 *       500:
 *         description: Server error.
 */
exports.getAllTasks = async (req, res, next) => {
  try {
    // Check Redis cache first
    const cachedTasks = await redisClient.get('tasks:all');
    if (cachedTasks) {
      return res.status(200).json({ tasks: JSON.parse(cachedTasks), source: 'cache' });
    }

    // Fetch from MongoDB if not cached
    const tasks = await Task.find();
    if (!tasks.length) return res.status(404).json({ error: 'No tasks found' });

    // Cache the results in Redis
    await redisClient.set('tasks:all', JSON.stringify(tasks), { EX: 3600 }); // Cache for 1 hour

    res.status(200).json({ tasks, source: 'database' });
  } catch (error) {
    console.error('Error retrieving all tasks:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The updated description of the task.
 *               status:
 *                 type: string
 *                 description: The updated status of the task.
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *                 task:
 *                   type: object
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Task not found
 *       500:
 *         description: Server error.
 */
exports.updateTaskById = async (req, res, next) => {
  const { id } = req.params;
  const { description, status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { description, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the Redis cache
    const redisKey = `task:${id}:status`;
    await redisClient.set(redisKey, updatedTask.status);

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
};
