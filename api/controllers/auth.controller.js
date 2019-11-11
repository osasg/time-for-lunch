'use strict';

const bcrypt = require('bcrypt');
const { to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const status = require('http-status');

const { loginValidator } = require('../../validators/');

const postSignIn = async (req, res, next) => {
  const { Account } = req.repos;
  const { username, password } = req.body;

  try {
    const account = await Account.findByUsername({ username });

    if (!account)
      return res.status(status.OK)
        .send({
          success: false,
          message: 'Login failed',
          error: {
            username: 'Account doesn\'t exist!'
          },
          token: null
        });

    const result = await bcrypt.compare(password, account.password);

    if (!result)
      return res.status(status.OK)
        .send({
          success: false,
          message: 'Login failed',
          error: {
            password: 'Password incorrect'
          },
          token: null
        });

    res.status(status.OK)
      .send({
        success: true,
        message: 'Login successfully',
        error: null,
        token: generateJWT(account)
      });
  } catch (err) {
    next(err);
  }
}

const postSignUp = async (req, res, next) => {
  const { Account } = req.repos;
  const { username, password } = req.body;
  const [ err1, account ] = await to(Account.create({ username, password }));
  if (err1) return next(err1);

  res.status(200).send({
    success: true,
    message: "Registered",
    token: generateJWT(account)
  });
}

/**private */
const generateJWT = ({ _id, username }) => {
  const payloadToken = { _id, username };

  return jwt.sign(payloadToken, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES)
  });
};

module.exports = {
  postSignIn,
  postSignUp
}
