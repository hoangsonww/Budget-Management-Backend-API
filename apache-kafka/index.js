const fs = require('fs');
const path = require('path');
const { connectToKafka, publishEvent, registerConsumer, healthCheck } = require('./kafkaService');

const samplePath = path.join(__dirname, '..', 'files', 'kafka', 'sample-events.jsonl');

const loadSampleEvents = () => {
  if (!fs.existsSync(samplePath)) return [];
  const lines = fs.readFileSync(samplePath, 'utf8').split('\n').filter(Boolean);
  return lines
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);
};

const runDemo = async () => {
  const connected = await connectToKafka();
  if (!connected) return;

  await registerConsumer('budget-events', async ({ message }) => {
    console.log('Budget event received:', message.eventType, message.payload?.budgetId);
  });

  await registerConsumer('expense-events', async ({ message }) => {
    console.log('Expense event received:', message.eventType, message.payload?.expenseId);
  });

  const status = await healthCheck();
  console.log('Kafka health:', status);

  const events = loadSampleEvents();
  for (const event of events) {
    await publishEvent(event.topic, event.eventType, event.payload, {
      key: event.key,
      source: 'kafka-demo',
      correlationId: event.correlationId,
    });
  }

  if (!events.length) {
    await publishEvent('budget-events', 'budget.demo', {
      budgetId: 'demo-budget-1',
      name: 'Demo Budget',
      limit: 1000,
    });
  }
};

runDemo().catch(err => console.error('Kafka demo failed:', err.message));
