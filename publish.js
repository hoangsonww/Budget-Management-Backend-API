const amqp = require('amqplib');
const config = require('./config/config');

/**
 * Publish a message to RabbitMQ (THIS IS A DEMO ONLY)
 * @param messageContent {string} - The message content to publish
 * @returns {Promise<void>} - A Promise that resolves when the message is published
 */
async function publishMessage(messageContent) {
  try {
    const connection = await amqp.connect(`amqp://${config.rabbitMQHost}`);
    const channel = await connection.createChannel();
    const queue = 'task_queue';

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(messageContent), { persistent: true });
    console.log(" [x] Sent '%s'", messageContent);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('RabbitMQ Error:', error);
  }
}

const message = 'This is a test message!';

publishMessage(message);
