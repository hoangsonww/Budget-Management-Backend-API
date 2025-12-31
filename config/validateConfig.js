const config = require('./config');

const requiredEnv = [
  'MONGO_DB_URI',
  'REDIS_URL',
  'RABBITMQ_URL',
  'KAFKA_BROKER',
  'JWT_SECRET',
  'ELASTIC_SEARCH_URL',
  'POSTGRES_URL',
];

const missing = requiredEnv.filter(key => !process.env[key]);
const resolved = {
  mongoURI: config.mongoURI,
  redisUrl: config.redisUrl,
  rabbitMQUrl: config.rabbitMQUrl,
  kafkaBroker: config.kafkaBroker,
  jwtSecret: config.jwtSecret ? 'set' : 'missing',
  elasticSearchUrl: config.elasticSearchUrl,
  postgresUrl: config.postgresUrl,
};

console.log('Config validation results:');
console.log(JSON.stringify(resolved, null, 2));

if (missing.length) {
  console.warn('Missing environment variables (using defaults):', missing.join(', '));
  process.exitCode = 1;
} else {
  console.log('All required environment variables are set.');
}
