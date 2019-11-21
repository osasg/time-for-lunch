const expressJoiValidator = require('express-joi-validation');

const loginValidator = require('./login.validator');

const createValidator = (type, schema) => {
  const valid = (req, res, next) => expressJoiValidator.createValidator({ passError: true })[type](schema)(req, res, next);

  valid.schema = schema;
  return valid;
}

module.exports = Object.create({
  loginValidator,
  loginBodyValidator: createValidator('body', loginValidator)
});
