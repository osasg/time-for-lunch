const express = require('express');
const bodyParser = require('body-parser');
const co = require('co');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = 3000;

co(function * () {
  yield app.prepare();

  const server = express();
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use(express.static('public'));
  server.use((req, res, next) => {
    next();
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT);
  console.log(`Server is now listening on PORT: ${PORT}`);

}).catch(error => console.error(error.stack));