const { Client } = require('elasticsearch'); // Use legacy client for Elasticsearch 6.x
const config = require('../config/config');

// Initialize Elasticsearch client
const esClient = new Client({
  host: config.elasticSearchUrl, // Elasticsearch server URL
  log: 'info',
});

/**
 * Check if Elasticsearch is connected and the index exists
 */
const initializeElasticSearch = async () => {
  try {
    // Check cluster health
    const health = await esClient.cluster.health({});
    console.log('Elasticsearch cluster health:', health.status);

    // Check if the "expenses" index exists
    const indexExists = await esClient.indices.exists({ index: 'expenses' });
    if (!indexExists) {
      // Create the "expenses" index with mappings
      await esClient.indices.create({
        index: 'expenses',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              description: { type: 'text' },
              amount: { type: 'float' },
              budgetId: { type: 'keyword' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
      console.log('Elasticsearch "expenses" index created.');
    } else {
      console.log('Elasticsearch "expenses" index already exists.');
    }
  } catch (error) {
    console.error('Error initializing Elasticsearch:', error.message);
  }
};

// Initialize Elasticsearch
initializeElasticSearch();

// Export the client
module.exports = esClient;
