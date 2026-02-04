const mongoose = require('mongoose');
const os = require('os');
const redisClient = require('../services/redisService');
const esClient = require('../services/elasticService');
const pool = require('../services/postgresService');
const { healthCheck } = require('../apache-kafka/kafkaService');
const { getRabbitMQStatus } = require('../services/rabbitMQService');
const Budget = require('../models/budget');
const Expense = require('../models/expense');
const Task = require('../models/task');
const Customer = require('../models/customer');
const Order = require('../models/order');

const mongoStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = mongoose.connection.readyState;
  return states[state] || 'unknown';
};

const redisStatus = async () => {
  if (!redisClient.isOpen) {
    return { status: 'disconnected' };
  }
  try {
    const pong = await redisClient.ping();
    return { status: 'ok', pong };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};

const elasticStatus = async () => {
  try {
    await esClient.ping({ requestTimeout: 1000 });
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};

const postgresStatus = async () => {
  try {
    await pool.query('SELECT 1');
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};

const getPing = (_req, res) => {
  res.status(200).json({ pong: true });
};

const getHealth = async (_req, res) => {
  const [redis, elastic, postgres, kafka] = await Promise.all([redisStatus(), elasticStatus(), postgresStatus(), healthCheck()]);

  const rabbitStatus = getRabbitMQStatus();
  const mongo = { status: mongoStatus() };

  const serviceStates = [mongo.status, redis.status, elastic.status, postgres.status, kafka.status, rabbitStatus.connected ? 'ok' : 'error'];
  const overall = serviceStates.includes('error') ? 'degraded' : 'ok';

  res.status(overall === 'ok' ? 200 : 207).json({
    status: overall,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    host: {
      hostname: os.hostname(),
      platform: os.platform(),
      cpuCount: os.cpus().length,
    },
    services: {
      mongo,
      redis,
      elastic,
      postgres,
      kafka,
      rabbitmq: rabbitStatus,
    },
  });
};

const getMetrics = async (_req, res, next) => {
  try {
    const [budgets, expenses, tasks, customers, orders] = await Promise.all([
      Budget.countDocuments(),
      Expense.countDocuments(),
      Task.countDocuments(),
      Customer.countDocuments(),
      Order.countDocuments(),
    ]);

    res.status(200).json({
      timestamp: new Date().toISOString(),
      counts: {
        budgets,
        expenses,
        tasks,
        customers,
        orders,
      },
      process: {
        uptimeSeconds: Math.round(process.uptime()),
        memoryBytes: process.memoryUsage(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPing,
  getHealth,
  getMetrics,
};
