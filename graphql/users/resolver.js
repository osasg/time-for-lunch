const Query = require('./user.query');
const Mutation = require('./user.mutation');

module.exports = {
  resolver: {
    Query,
    Mutation
  }
}