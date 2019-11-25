const { authMiddleware: auth } = require('./middlewares/');

module.exports = app => {
  app.get([ '/lunch', '/home' ], (req, res) => res.redirect('/'));

  app.get(['/', '/profile'], auth.requireAuth);

  app.get('/admin', auth.requireAuth, auth.requireRole([ 'ADMIN' ]));

  app.get('/admin/meals', auth.requireAuth, auth.requireRole([ 'ADMIN' ]));

  app.get('/admin/meals/:id', auth.requireAuth, auth.requireRole([ 'ADMIN' ]));

  app.get('/admin/users', auth.requireAuth, auth.requireRole([ 'ADMIN' ]));

  app.get('/admin/lunches', auth.requireAuth, auth.requireRole([ 'ADMIN' ]));

  app.get('/admin/lunches/:id', auth.requireAuth, auth.requireRole([ 'ADMIN' ]));
}