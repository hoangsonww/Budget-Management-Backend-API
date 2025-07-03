jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(),
}));

jest.mock('../services/redisService', () => ({}));

jest.mock('../apache-kafka/kafkaService', () => ({
  connectToKafka: jest.fn().mockResolvedValue(),
}));

jest.mock('../services/rabbitMQService', () => ({
  connectToRabbitMQ: jest.fn().mockResolvedValue(),
}));

jest.mock('../services/dataSeeder', () => jest.fn().mockResolvedValue());

jest.mock('../grpcServer', () => jest.fn());

jest.mock('morgan', () => () => (req, res, next) => next());

jest.mock('serve-favicon', () => () => (req, res, next) => next());

jest.mock('../routes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/ping', (_req, res) => res.json({ pong: true }));
  return router;
});

jest.mock('swagger-ui-express', () => ({
  serve: jest.fn((req, res, next) => next()),
  setup: jest.fn(() => {
    return (_req, res) => res.send('<html>SWAGGER UI</html>');
  }),
}));

const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../index');

describe('Express app', () => {
  beforeAll(() => {
    // create views/home.html
    const viewsDir = path.join(__dirname, '../views');
    fs.mkdirSync(viewsDir, { recursive: true });
    fs.writeFileSync(path.join(viewsDir, 'home.html'), '<h1>Home Page</h1>');

    // create public/test.txt for static serving
    const publicDir = path.join(__dirname, '../public');
    fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, 'test.txt'), 'Hello, Static!');
  });

  afterAll(() => {
    // clean up views/home.html
    const htmlPath = path.join(__dirname, '../views/home.html');
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);

    // clean up public/test.txt
    const txtPath = path.join(__dirname, '../public/test.txt');
    if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
  });

  it('serves the homepage at GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<h1>Home Page</h1>');
  });

  it('serves Swagger UI at GET /docs', async () => {
    const res = await request(app).get('/docs');
    expect(res.status).toBe(200);
    expect(res.text).toContain('SWAGGER UI');
  });

  it('responds on ping route under /api', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ pong: true });
  });

  it('includes CORS headers on API responses', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('serves static files from public/', async () => {
    const res = await request(app).get('/test.txt');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello, Static!');
    expect(res.headers['content-type']).toMatch(/text\/plain/);
  });

  it('404s on unknown non-API route', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('404s on nonexistent /api path', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});
