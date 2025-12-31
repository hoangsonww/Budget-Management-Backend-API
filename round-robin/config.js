module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/round_robin',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  backendPorts: (process.env.BACKEND_PORTS || '5001,5002,5003')
    .split(',')
    .map(port => Number(port.trim()))
    .filter(port => Number.isFinite(port)),
  healthIntervalMs: Number(process.env.HEALTH_INTERVAL_MS || 5000),
  backendTimeoutMs: Number(process.env.BACKEND_TIMEOUT_MS || 2000),
};
