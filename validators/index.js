const validator = require('express-joi-validation');

const loginBodyValidator = require('./login-body.validator');

const createValidator = (type, schema) => {
  const valid = (req, res, next) => validator.createValidator({ passError: true })[type](schema)(req, res, next);

  valid.schema = schema;
  return valid;
}

module.exports = Object.create({
  loginBodyValidator: createValidator('body', loginBodyValidator)
});
