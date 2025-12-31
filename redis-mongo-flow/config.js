module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  port: Number(process.env.PORT || 3001),
  dbName: process.env.MONGO_DB_NAME || 'myDatabase',
  collectionName: process.env.MONGO_COLLECTION || 'myCollection',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS || 3600),
};
