const glue = require('schemaglue');

const { schema, resolver } = glue('graphql', {
  js: '**/*.js'
});

module.exports = {
  typeDefs: schema,
  resolvers: resolver
}