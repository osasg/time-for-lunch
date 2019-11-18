const { authMiddleware: auth } = require('./middlewares/');

module.exports = app => {
  app.get('/home', (req, res) => res.redirect('/'));

  app.get('/', auth.requireAuth);

  app.get(['/admin', '/admin/*'], auth.requireAuth, auth.requireRole([ 'ADMIN' ]));
}