const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const redisClient = require('./services/redisService');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swaggerConfig');
const { connectToKafka } = require('./apache-kafka/kafkaService');
const routes = require('./routes');
const config = require('./config/config');
const { connectToRabbitMQ } = require('./services/rabbitMQService');
const seedMongoData = require('./services/dataSeeder');
const startGrpcServer = require('./grpcServer');
const cors = require('cors');
const morgan = require('morgan');

// Environment Variable Configuration
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

// CORS
app.use(cors()); // Enable All CORS Requests

// Body Parser Middleware
app.use(express.json());

// Request Logging Middleware
app.use(morgan('dev')); // Logs all incoming requests to the console

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Setup
const swaggerOptions = { customSiteTitle: 'Budget Management API Documentation' };
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));

// Function to Retry Connections
const retryConnection = async (connectFunction, serviceName, delay = 5000) => {
  while (true) {
    try {
      await connectFunction();
      console.log(`${serviceName} connected successfully.`);
      break; // Exit the retry loop on success
    } catch (error) {
      console.error(`${serviceName} connection failed. Retrying in ${delay / 1000} seconds...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
};

// MongoDB Connection
retryConnection(
  async () => {
    await mongoose.connect(config.mongoURI, {});
  },
  'MongoDB'
);

// Kafka Connection (optional, non-critical)
retryConnection(connectToKafka, 'Kafka');

// RabbitMQ Connection
retryConnection(connectToRabbitMQ, 'RabbitMQ');

// Seed MongoDB Data
seedMongoData().catch(err => console.error('Failed to seed MongoDB data:', err.message));

// Routes
app.use('/api', routes);

// Homepage
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'views', 'home.html');

  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err.message);
      return res.status(500).send('An error occurred while loading the homepage.');
    }

    res.send(data);
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

// Start gRPC Server
startGrpcServer();

// Server Start
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/docs for API documentation`);
});

module.exports = app;
