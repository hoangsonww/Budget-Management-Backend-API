const { Kafka, logLevel } = require('kafkajs');
const crypto = require('crypto');
const config = require('../config/config');

const DEFAULT_TOPICS = [
  { topic: 'budget-events', numPartitions: 3, replicationFactor: 1 },
  { topic: 'expense-events', numPartitions: 3, replicationFactor: 1 },
  { topic: 'task-events', numPartitions: 2, replicationFactor: 1 },
  { topic: 'dlq-events', numPartitions: 1, replicationFactor: 1 },
];

const normalizeBroker = broker => broker.replace(/^[a-zA-Z]+:\/\//, '').trim();
const brokerList = (config.kafkaBroker || process.env.KAFKA_BROKER || '')
  .split(',')
  .map(normalizeBroker)
  .filter(Boolean);

const normalizePem = value => (value ? value.replace(/\\n/g, '\n') : undefined);
const sslConfig = process.env.KAFKA_SSL_CA
  ? {
      ca: [normalizePem(process.env.KAFKA_SSL_CA)],
      cert: normalizePem(process.env.KAFKA_SSL_CERT),
      key: normalizePem(process.env.KAFKA_SSL_KEY),
    }
  : undefined;

const saslConfig = process.env.KAFKA_SASL_USERNAME
  ? {
      mechanism: process.env.KAFKA_SASL_MECHANISM || 'plain',
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD || '',
    }
  : undefined;

const kafkaEnabled = brokerList.length > 0;
const clientId = process.env.KAFKA_CLIENT_ID || 'budget-manager';
const groupId = process.env.KAFKA_GROUP_ID || 'budget-manager-workers';
const kafkaLogLevel = process.env.KAFKA_LOG_LEVEL || 'WARN';

const kafka = kafkaEnabled
  ? new Kafka({
      clientId,
      brokers: brokerList,
      logLevel: logLevel[kafkaLogLevel] || logLevel.WARN,
      ssl: sslConfig || undefined,
      sasl: saslConfig || undefined,
    })
  : null;

const producer = kafka ? kafka.producer({ allowAutoTopicCreation: false }) : null;
const consumer = kafka ? kafka.consumer({ groupId }) : null;
const admin = kafka ? kafka.admin() : null;

let connected = false;
let consumerRunning = false;
const registeredHandlers = new Map();
const subscribedTopics = new Set();

const ensureTopics = async topics => {
  if (!admin) return;
  const topicConfig = topics?.length ? topics : DEFAULT_TOPICS;
  await admin.connect();
  await admin.createTopics({
    topics: topicConfig,
    waitForLeaders: true,
  });
  await admin.disconnect();
};

const buildEventEnvelope = (eventType, payload, metadata = {}) => ({
  eventId: crypto.randomUUID(),
  eventType,
  emittedAt: new Date().toISOString(),
  source: metadata.source || 'budget-manager',
  correlationId: metadata.correlationId || crypto.randomUUID(),
  payload,
  tags: metadata.tags || [],
});

const subscribeTopic = async (topic, options = {}) => {
  if (!consumer || subscribedTopics.has(topic)) return;
  await consumer.subscribe({ topic, fromBeginning: options.fromBeginning || false });
  subscribedTopics.add(topic);
};

const registerConsumer = async (topic, handler, options = {}) => {
  if (!consumer) return;
  const key = `${topic}:${options.eventType || '*'}`;
  registeredHandlers.set(key, { handler, options });
  if (connected) {
    try {
      await subscribeTopic(topic, options);
    } catch (err) {
      console.warn('Kafka subscribe warning:', err.message);
    }
  }
};

const startConsumerLoop = async () => {
  if (!consumer || consumerRunning) return;
  consumerRunning = true;
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = message.value?.toString() || '';
      let parsed = payload;
      try {
        parsed = JSON.parse(payload);
      } catch (err) {
        parsed = { raw: payload };
      }

      for (const [key, entry] of registeredHandlers.entries()) {
        const [registeredTopic, eventType] = key.split(':');
        if (registeredTopic !== topic) continue;
        if (eventType !== '*' && parsed?.eventType !== eventType) continue;
        await entry.handler({
          topic,
          partition,
          message: parsed,
          headers: message.headers || {},
        });
      }
    },
  });
};

const connectToKafka = async () => {
  if (!kafkaEnabled) {
    console.warn('Kafka broker not configured. Skipping Kafka initialization.');
    return false;
  }

  try {
    await ensureTopics();
    await producer.connect();
    await consumer.connect();
    connected = true;
    console.log('Kafka Producer and Consumer Connected');

    await registerConsumer('budget-events', async ({ message }) => {
      console.log('Budget event received:', message);
    });
    await registerConsumer('task-events', async ({ message }) => {
      console.log('Task event received:', message);
    });

    for (const key of registeredHandlers.keys()) {
      const [topic] = key.split(':');
      await subscribeTopic(topic);
    }

    await startConsumerLoop();
    return true;
  } catch (err) {
    console.warn('Kafka Connection Error:', err.message);
    console.warn('Kafka is optional. Proceeding without Kafka.');
    return false;
  }
};

const publishEvent = async (topic, eventType, payload, metadata = {}) => {
  if (!producer || !connected) return null;
  const envelope = buildEventEnvelope(eventType, payload, metadata);
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: metadata.key || envelope.eventId,
          value: JSON.stringify(envelope),
          headers: metadata.headers || {},
        },
      ],
    });
    return envelope;
  } catch (err) {
    console.warn('Error sending event to Kafka:', err.message);
    await publishToDlq(topic, envelope, err);
    return null;
  }
};

const publishToDlq = async (sourceTopic, envelope, error) => {
  if (!producer || !connected) return;
  const dlqPayload = {
    sourceTopic,
    error: error?.message || 'Unknown error',
    envelope,
  };
  await producer.send({
    topic: 'dlq-events',
    messages: [{ value: JSON.stringify(dlqPayload) }],
  });
};

const sendMessageToKafka = async (topic, message) => {
  if (!producer || !connected) return;
  const value = typeof message === 'string' ? message : JSON.stringify(message);
  try {
    await producer.send({
      topic,
      messages: [{ value }],
    });
    console.log(`Sent message to Kafka: ${value}`);
  } catch (err) {
    console.warn('Error sending message to Kafka:', err.message);
  }
};

const healthCheck = async () => {
  if (!admin || !kafkaEnabled) return { status: 'disabled' };
  try {
    await admin.connect();
    const metadata = await admin.fetchTopicMetadata();
    await admin.disconnect();
    return { status: 'ok', brokers: metadata.brokers?.length || 0 };
  } catch (err) {
    return { status: 'error', error: err.message };
  }
};

const disconnectKafka = async () => {
  if (!producer || !consumer) return;
  await consumer.disconnect();
  await producer.disconnect();
  connected = false;
  consumerRunning = false;
  subscribedTopics.clear();
};

module.exports = {
  connectToKafka,
  publishEvent,
  registerConsumer,
  sendMessageToKafka,
  healthCheck,
  disconnectKafka,
};
