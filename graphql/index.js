const glue = require('schemaglue');

const schemaDirectives = require('./directives/');

const { schema, resolver } = glue('graphql', {
  js: '**/*.js'
});

module.exports = {
  typeDefs: schema,
  resolvers: resolver,
  schemaDirectives
}