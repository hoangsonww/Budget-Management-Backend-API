const express = require('express');
const redis = require('redis');
const { MongoClient } = require('mongodb');
const config = require('./config');

const app = express();
app.use(express.json());

const mongoClient = new MongoClient(config.mongoURI);
const redisClient = redis.createClient({ url: config.redisUrl });

const stats = {
  cacheHits: 0,
  cacheMisses: 0,
};

const getCollection = () => mongoClient.db(config.dbName).collection(config.collectionName);

const ensureIndexes = async () => {
  await getCollection().createIndex({ key: 1 }, { unique: true });
};

redisClient.on('error', err => console.error('Redis Client Error', err));

app.get('/data/:key', async (req, res) => {
  const key = req.params.key;
  const bypassCache = req.query.refresh === 'true';

  try {
    if (!bypassCache) {
      const cached = await redisClient.get(key);
      if (cached) {
        stats.cacheHits += 1;
        return res.json({ source: 'redis', data: JSON.parse(cached) });
      }
    }

    stats.cacheMisses += 1;
    const record = await getCollection().findOne({ key });
    if (!record) {
      return res.status(404).json({ message: 'Data not found' });
    }

    await redisClient.setEx(key, config.cacheTtlSeconds, JSON.stringify(record));
    return res.json({ source: 'mongodb', data: record });
  } catch (error) {
    console.error('Error retrieving data:', error);
    return res.status(500).json({ message: 'Error retrieving data' });
  }
});

app.post('/data', async (req, res) => {
  const { key, value } = req.body;
  if (!key || typeof value === 'undefined') {
    return res.status(400).json({ message: 'Both key and value are required.' });
  }

  try {
    const now = new Date();
    await getCollection().updateOne(
      { key },
      {
        $set: { key, value, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    const record = await getCollection().findOne({ key });
    await redisClient.setEx(key, config.cacheTtlSeconds, JSON.stringify(record));

    return res.status(201).json({ message: 'Data stored', data: record });
  } catch (error) {
    console.error('Error storing data:', error);
    return res.status(500).json({ message: 'Error storing data' });
  }
});

app.delete('/data/:key', async (req, res) => {
  const key = req.params.key;
  try {
    const result = await getCollection().deleteOne({ key });
    await redisClient.del(key);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    return res.json({ message: 'Data deleted', key });
  } catch (error) {
    console.error('Error deleting data:', error);
    return res.status(500).json({ message: 'Error deleting data' });
  }
});

app.get('/stats', async (_req, res) => {
  try {
    const totalRecords = await getCollection().countDocuments();
    res.json({
      cacheHits: stats.cacheHits,
      cacheMisses: stats.cacheMisses,
      totalRecords,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

async function startServer() {
  await mongoClient.connect();
  await redisClient.connect();
  await ensureIndexes();

  app.listen(config.port, () => {
    console.log(`Redis-Mongo Flow listening on port ${config.port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err.message);
});
