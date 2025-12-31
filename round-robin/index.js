const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const httpProxy = require('http-proxy');
const config = require('./config');

const MODE = process.env.MODE || 'all';
const LOAD_BALANCER_PORT = Number(process.env.PORT || 3000);
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 5001);

const redisClient = redis.createClient({ url: config.redisUrl });
redisClient.on('error', err => console.error('Redis Client Error', err));
redisClient.connect().catch(err => console.error('Redis Connection Error:', err.message));

mongoose
  .connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const backendPorts = config.backendPorts.length ? config.backendPorts : [5001, 5002, 5003];
const backendTargets = (process.env.BACKEND_TARGETS || '')
  .split(',')
  .map(target => target.trim())
  .filter(Boolean);

const resolveTargets = () => {
  if (backendTargets.length) return backendTargets;
  return backendPorts.map(port => `http://localhost:${port}`);
};

const startBackendServer = port => {
  const app = express();
  const stats = { requests: 0, startedAt: new Date().toISOString() };

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', port });
  });

  app.get('/stats', (_req, res) => {
    res.json(stats);
  });

  app.get('/', (_req, res) => {
    stats.requests += 1;
    res.send(`Hello from backend server running on port ${port}`);
  });

  app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });
};

const startLoadBalancer = () => {
  const loadBalancerApp = express();
  const proxy = httpProxy.createProxyServer();
  let currentIndex = 0;
  let healthyTargets = resolveTargets();
  const allTargets = resolveTargets();

  const refreshHealthyTargets = async () => {
    const results = await Promise.all(
      allTargets.map(async target => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), config.backendTimeoutMs);
          const response = await fetch(`${target}/health`, { signal: controller.signal });
          clearTimeout(timeout);
          return response.ok ? target : null;
        } catch (error) {
          return null;
        }
      })
    );

    healthyTargets = results.filter(Boolean);
    if (!healthyTargets.length) {
      healthyTargets = allTargets;
    }
  };

  const getNextServerInstance = () => {
    const targets = healthyTargets.length ? healthyTargets : allTargets;
    currentIndex = (currentIndex + 1) % targets.length;
    return targets[currentIndex];
  };

  proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(502).send('Bad gateway');
  });

  loadBalancerApp.get('/lb/status', async (_req, res) => {
    await refreshHealthyTargets();
    res.json({
      healthyTargets,
      allTargets,
      timestamp: new Date().toISOString(),
    });
  });

  loadBalancerApp.get('/', async (req, res) => {
    await refreshHealthyTargets();
    const target = getNextServerInstance();

    if (redisClient.isOpen) {
      try {
        await redisClient.hIncrBy('round_robin:requests', target, 1);
      } catch (error) {
        console.warn('Redis stats update failed:', error.message);
      }
    }

    console.log(`Routing request to: ${target}`);
    proxy.web(req, res, { target });
  });

  loadBalancerApp.listen(LOAD_BALANCER_PORT, () => {
    console.log(`Load balancer listening on port ${LOAD_BALANCER_PORT}`);
  });
};

if (MODE === 'all') {
  backendPorts.forEach(port => startBackendServer(port));
  startLoadBalancer();
} else if (MODE === 'backend') {
  startBackendServer(BACKEND_PORT);
} else if (MODE === 'balancer') {
  startLoadBalancer();
} else {
  console.error(`Unknown MODE: ${MODE}`);
}
