const amqp = require('amqplib');
const config = require('../config/config');
const Task = require('../models/task');
const redisClient = require('./redisService');
const { publishEvent } = require('../apache-kafka/kafkaService');

let connection, rabbitChannel;
let lastError = null;

// Retry connection logic
const RETRY_INTERVAL = 5000; // Retry every 5 seconds

const connectToRabbitMQ = async () => {
  try {
    if (!config.rabbitMQUrl) {
      throw new Error('RabbitMQ URL is not defined in the environment variables.');
    }

    console.log('Connecting to RabbitMQ...');
    connection = await amqp.connect(config.rabbitMQUrl);
    lastError = null;

    // Handle connection-level errors
    connection.on('error', err => {
      console.error('RabbitMQ Connection Error:', err.message);
      lastError = err.message;
      setTimeout(connectToRabbitMQ, RETRY_INTERVAL); // Reconnect on error
    });

    // Handle connection closure
    connection.on('close', () => {
      console.warn('RabbitMQ Connection Closed. Reconnecting...');
      lastError = 'connection closed';
      setTimeout(connectToRabbitMQ, RETRY_INTERVAL);
    });

    rabbitChannel = await connection.createChannel();

    const queue = 'task_queue';
    await rabbitChannel.assertQueue(queue, { durable: true });

    console.log('RabbitMQ Connected and Channel Created');

    // Consume messages from the queue
    rabbitChannel.consume(queue, async msg => {
      if (msg) {
        const taskData = JSON.parse(msg.content.toString());
        console.log(`Processing task: ${taskData.taskId}`);

        try {
          // Simulate task processing
          await new Promise(resolve => setTimeout(resolve, 5000));

          // Update task in MongoDB
          await Task.findByIdAndUpdate(taskData.taskId, { status: 'completed' });

          // Update task status in Redis
          await redisClient.set(`task:${taskData.taskId}:status`, 'completed');

          await publishEvent('task-events', 'task.completed', {
            taskId: taskData.taskId,
            description: taskData.description,
            status: 'completed',
          });

          rabbitChannel.ack(msg);
          console.log(`Task ${taskData.taskId} completed`);
        } catch (error) {
          console.error('Error processing task:', error);
          lastError = error.message;
          rabbitChannel.nack(msg);
        }
      }
    });

    // Handle channel errors
    rabbitChannel.on('error', err => {
      console.error('RabbitMQ Channel Error:', err.message);
      lastError = err.message;
    });

    // Handle channel closure
    rabbitChannel.on('close', () => {
      console.warn('RabbitMQ Channel Closed. Recreating...');
      lastError = 'channel closed';
      connectToRabbitMQ(); // Reconnect and recreate channel
    });
  } catch (err) {
    console.error('RabbitMQ Connection Error:', err.message);
    lastError = err.message;
    setTimeout(connectToRabbitMQ, RETRY_INTERVAL); // Retry connection on failure
  }
};

const sendToQueue = (queue, message) => {
  if (!rabbitChannel) {
    console.error('RabbitMQ Channel is not established. Message not sent.');
    return;
  }
  rabbitChannel.sendToQueue(queue, Buffer.from(message), { persistent: true });
};

module.exports = {
  connectToRabbitMQ,
  sendToQueue,
  getRabbitMQStatus: () => ({
    connected: Boolean(connection),
    channelReady: Boolean(rabbitChannel),
    lastError,
  }),
};
