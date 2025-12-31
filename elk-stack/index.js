const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const config = {
  elasticsearchUrl: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  logstashUrl: process.env.LOGSTASH_URL || 'http://localhost:8080',
  kibanaUrl: process.env.KIBANA_URL || 'http://localhost:5601',
  logFilePath: process.env.LOG_FILE_PATH || path.join(__dirname, 'logs', 'budget-api.log'),
  eventCount: Number(process.env.EVENT_COUNT || 50),
  intervalMs: Number(process.env.EVENT_INTERVAL_MS || 200),
  indexTemplateName: 'budget-events-template',
};

const ensureLogDir = () => {
  fs.mkdirSync(path.dirname(config.logFilePath), { recursive: true });
};

const generateEvent = () => {
  const status = faker.helpers.arrayElement([200, 201, 202, 400, 404, 409, 500]);
  const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
  const budgetId = faker.database.mongodbObjectId();
  const amount = faker.number.float({ min: 10, max: 1500, fractionDigits: 2 });
  return {
    '@timestamp': new Date().toISOString(),
    eventId: crypto.randomUUID(),
    level,
    service: 'budget-api',
    environment: process.env.NODE_ENV || 'development',
    message: `${faker.hacker.verb()} ${faker.hacker.noun()} for budget ${budgetId}`,
    http: {
      method: faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
      path: faker.helpers.arrayElement(['/api/budgets', '/api/expenses', '/api/tasks', '/api/search']),
      status,
      durationMs: faker.number.int({ min: 8, max: 1200 }),
    },
    budget: {
      id: budgetId,
      name: faker.helpers.arrayElement(['Travel', 'Groceries', 'Utilities', 'Subscriptions']),
      limit: faker.number.int({ min: 500, max: 20000 }),
    },
    expense: {
      id: faker.database.mongodbObjectId(),
      description: faker.commerce.productName(),
      amount,
      currency: 'USD',
    },
    tags: faker.helpers.arrayElements(['api', 'budget', 'expense', 'redis', 'mongo', 'kafka'], 2),
  };
};

const writeEventToFile = event => {
  ensureLogDir();
  fs.appendFileSync(config.logFilePath, `${JSON.stringify(event)}\n`, 'utf8');
};

const sendEventToLogstash = async event => {
  const response = await fetch(config.logstashUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Logstash error: ${response.status} ${text}`);
  }
};

const checkEndpoint = async url => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (err) {
    return false;
  }
};

const ensureIndexTemplate = async () => {
  const body = {
    index_patterns: ['budget-events-*'],
    template: {
      settings: {
        number_of_shards: 1,
      },
      mappings: {
        properties: {
          '@timestamp': { type: 'date' },
          level: { type: 'keyword' },
          service: { type: 'keyword' },
          environment: { type: 'keyword' },
          message: { type: 'text' },
          'http.method': { type: 'keyword' },
          'http.path': { type: 'keyword' },
          'http.status': { type: 'integer' },
          'http.durationMs': { type: 'integer' },
          'budget.id': { type: 'keyword' },
          'budget.name': { type: 'keyword' },
          'budget.limit': { type: 'double' },
          'expense.id': { type: 'keyword' },
          'expense.description': { type: 'text' },
          'expense.amount': { type: 'double' },
          tags: { type: 'keyword' },
        },
      },
    },
  };

  const response = await fetch(`${config.elasticsearchUrl}/_index_template/${config.indexTemplateName}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Elasticsearch template error: ${response.status} ${text}`);
  }
};

const run = async () => {
  const elasticReady = await checkEndpoint(config.elasticsearchUrl);
  const kibanaReady = await checkEndpoint(config.kibanaUrl);

  if (!elasticReady) {
    console.error('Elasticsearch not reachable.');
    return;
  }

  if (!kibanaReady) {
    console.warn('Kibana not reachable (continuing).');
  }

  await ensureIndexTemplate();

  for (let i = 0; i < config.eventCount; i += 1) {
    const event = generateEvent();
    writeEventToFile(event);
    try {
      await sendEventToLogstash(event);
      console.log(`Shipped event ${i + 1}/${config.eventCount}`);
    } catch (err) {
      console.warn(`Failed to ship event ${i + 1}:`, err.message);
    }

    if (config.intervalMs > 0) {
      await new Promise(resolve => setTimeout(resolve, config.intervalMs));
    }
  }
};

run().catch(err => console.error('ELK demo failed:', err.message));
