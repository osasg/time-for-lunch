const { authMiddleware: auth } = require('./middlewares/');

module.exports = app => {
  app.get(['/', '/home'], (req, res) => res.redirect('/login'));

  app.get('/lunch', auth.requireAuth);

  app.get(['/admin', '/admin/*'], auth.requireAuth, auth.requireRole([ 'ADMIN' ]));
}