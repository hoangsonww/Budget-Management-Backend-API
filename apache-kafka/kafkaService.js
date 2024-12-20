const { Kafka } = require('kafkajs');
const config = require('../config/config');

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'demo-kafka-app',
  brokers: [config.kafkaBroker],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

// Function to connect to Kafka
async function connectToKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    console.log('Kafka Producer and Consumer Connected');

    // Subscribe to Kafka topic
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    // Consume messages from Kafka
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });
      },
    });
  } catch (err) {
    console.warn('Kafka Connection Error:', err.message);
    console.warn('Kafka is optional. Proceeding without Kafka.');
  }
}

// Kafka Message Producer
async function sendMessageToKafka(topic, message) {
  try {
    await producer.send({
      topic: topic,
      messages: [{ value: message }],
    });
    console.log(`Sent message to Kafka: ${message}`);
  } catch (err) {
    console.warn('Error sending message to Kafka:', err.message);
  }
}

// Export Kafka functions
module.exports = {
  connectToKafka,
  sendMessageToKafka,
};
