const express = require('express');
const bodyParser = require('body-parser');
const co = require('co');
const next = require('next');
const { ApolloServer } = require('apollo-server-express');

const config = require('./config/');
const repositories = require('./repositories/');
const apiRoute = require('./api/routes/');
const { typeDefs, resolvers } = require('./graphql/');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

co(function * () {
  process.on('uncaughtException', err => {
    console.error('Unhandled Exception', err);
  });

  process.on('uncaughtRejection', (err, promise) => {
    console.error('Unhandled Rejection', err);
  });

  yield nextApp.prepare();

  const { db } = yield config.initialize();
  const repos = yield repositories.initialize({ db });

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.static('public'));

  app.use((req, res, next) => {
    req.db = db;
    req.repos = repos;
    next();
  })

  app.use('/api/', apiRoute);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        db: db,
        repos: repos
      }
    }
  });

  apolloServer.applyMiddleware({ app });

  app.get('*', (req, res) => {
    return handle(req, res);
  })

  const PORT = global.configuration.server.port;

  app.listen(PORT, () => {
    console.log(`ApolloServer is now ready at ${apolloServer.graphqlPath}`);
    console.log(`Server is now listening on PORT: ${PORT}`);
  });

}).catch(error => console.error(error.stack));