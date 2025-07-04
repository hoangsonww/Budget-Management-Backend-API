// __tests__/app.mocha.test.cjs
const chai       = require('chai');
const chaiHttp   = require('chai-http');
const proxyquire = require('proxyquire').noCallThru();
const express    = require('express');
const path       = require('path');
const fs         = require('fs');

chai.use(chaiHttp);
const { expect } = chai;

describe('Express app (Mocha & Chai)', function() {
  let app;

  before(function() {
    // 1) Prepare static files
    fs.mkdirSync(path.join(__dirname, '../views'), { recursive: true });
    fs.writeFileSync(path.join(__dirname, '../views/home.html'), '<h1>Home Page</h1>');
    fs.mkdirSync(path.join(__dirname, '../public'), { recursive: true });
    fs.writeFileSync(path.join(__dirname, '../public/test.txt'), 'Hello, Static!');

    // 2) Stub all external modules exactly as index.js requires them
    const stubs = {
      mongoose: { connect: () => Promise.resolve() },
      './services/redisService': {},
      './apache-kafka/kafkaService': { connectToKafka: () => Promise.resolve() },
      './services/rabbitMQService': { connectToRabbitMQ: () => Promise.resolve() },
      './services/dataSeeder': () => Promise.resolve(),
      './grpcServer': () => {},
      morgan: () => (req, res, next) => next(),
      'serve-favicon': () => (req, res, next) => next(),
      'swagger-ui-express': {
        serve: (_req, _res, next) => next(),
        setup: () => (_req, res) => res.send('<html>SWAGGER UI</html>')
      },
      './routes': (() => {
        const router = express.Router();
        router.get('/ping', (_req, res) => res.json({ pong: true }));
        return router;
      })(),
    };

    // 3) Load index.js via proxyquire and grab the exported app
    app = proxyquire('../index', stubs);
  });

  after(function() {
    // clean up test files
    const v = path.join(__dirname, '../views/home.html');
    if (fs.existsSync(v)) fs.unlinkSync(v);
    const p = path.join(__dirname, '../public/test.txt');
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  it('serves the homepage at GET /', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.include('<h1>Home Page</h1>');
        done();
      });
  });

  it('serves Swagger UI at GET /docs', (done) => {
    chai.request(app)
      .get('/docs')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.include('SWAGGER UI');
        done();
      });
  });

  it('responds on ping route under /api', (done) => {
    chai.request(app)
      .get('/api/ping')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ pong: true });
        done();
      });
  });

  it('includes CORS headers on API responses', (done) => {
    chai.request(app)
      .get('/api/ping')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.header('access-control-allow-origin', '*');
        done();
      });
  });

  it('serves static files from public/', (done) => {
    chai.request(app)
      .get('/test.txt')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello, Static!');
        // allow for optional charset parameter
        expect(res).to.have.header('content-type');
        expect(res.header['content-type']).to.match(/^text\/plain(?:;.*)?$/);
        done();
      });
  });

  it('404s on unknown non-API route', (done) => {
    chai.request(app)
      .get('/does-not-exist')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('404s on nonexistent /api path', (done) => {
    chai.request(app)
      .get('/api/does-not-exist')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
