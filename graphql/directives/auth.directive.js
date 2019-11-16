const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const { to } = require('await-to-js');

class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const [ , , { user } ] = args;

      if(!user)
        throw new Error('User not authenticated');

      return resolve.apply(this, args);
    };
  }
}

module.exports = {
  RequireAuthDirective
}