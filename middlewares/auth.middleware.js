const jwt = require('jsonwebtoken');
const { to } = require('await-to-js');

const requireAuth = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(status.UNAUTHORIZED).send({
      success: false,
      message: 'This site require authorization'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
    if (err)
      return res.status(status.UNAUTHORIZED).send({
        success: false,
        message: 'Token invalid',
      });

    req.user = decodedPayload;
    next();
  });
};

const requireRole = roles => async (req, res, next) => {
  const [ err, accountRoles ] = await to(Account.findRolesById({ _id: req.user._id }));
  if (err) return next(err);

  if (roles.some(role => accountRoles.includes(role)))
    return next();

  res.status(status.FORBIDDEN).send({
    success: false,
    message: 'Do not have permission to access this resource',
  });
};

module.exports = {
  requireAuth,
  requireRole
}
