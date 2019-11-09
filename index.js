const express = require('express');
const bodyParser = require('body-parser');
const co = require('co');
const next = require('next');

const config = require('./config/');
const repositories = require('./repositories/');

const apiRoute = require('./api/routes/');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

co(function * () {
  process.on('uncaughtException', err => {
    console.error('Unhandled Exception', err);
  });

  process.on('uncaughtRejection', (err, promise) => {
    console.error('Unhandled Rejection', err);
  });

  yield app.prepare();

  const { db } = yield config.initialize();
  const repos = yield repositories.initialize({ db });

  const server = express();

  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  server.use(express.static('public'));

  server.use((req, res, next) => {
    req.db = db;
    req.repos = repos;
    next();
  })

  server.use('/api/', apiRoute);

  server.get('*', (req, res) => {
    return handle(req, res);
  })

  const PORT = global.configuration.server.port;

  server.listen(PORT);
  console.log(`Server is now listening on PORT: ${PORT}`);

}).catch(error => console.error(error.stack));