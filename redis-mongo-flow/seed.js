const { MongoClient } = require('mongodb');
const config = require('./config');

// Provide data to MongoDB for testing
async function seedData() {
  const mongoClient = new MongoClient(config.mongoURI);
  try {
    await mongoClient.connect();

    const mongodb = mongoClient.db(config.dbName);
    const collection = mongodb.collection(config.collectionName);

    const data = [
      { key: 'user123', value: { name: 'Alice', age: 30 }, createdAt: new Date() },
      { key: 'product456', value: { name: 'Widget', price: 9.99 }, createdAt: new Date() },
      { key: 'order789', value: { product: 'product456', quantity: 5 }, createdAt: new Date() },
      { key: 'customer999', value: { name: 'Bob', email: 'customer999@gmail.com' }, createdAt: new Date() },
      { key: 'bill1234', value: { order: 'David', total: 49.95 }, createdAt: new Date() },
    ];

    await collection.insertMany(data);
    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoClient.close();
  }
}

seedData();
