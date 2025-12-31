require('dotenv').config();

// Load environment variables from .env file
module.exports = {
  mongoURI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/budget_manager',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  rabbitMQUrl: process.env.RABBITMQ_URL || 'amqp://localhost',
  kafkaBroker: process.env.KAFKA_BROKER || 'localhost:9092',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  elasticSearchUrl:
    process.env.ELASTIC_SEARCH_URL || process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  postgresUrl: process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/budget_manager',
};
