const express = require('express');
const { path } = require('ramda');

module.exports = function Login({
  logger,
  jsonParser,
  authenticateUser,
  createUserSession,
}) {
  const router = express.Router();

  router.post(
    '/login',
    jsonParser,
    authenticateUser,
    createUserSession,
    (req, res) => {
      return res.redirect(req.query.returnUrl);
    },
  );

  router.get('/login', async (req, res, next) => {
    try {
      logger.info('GET /auth/login');

      const notification = path(['session', 'notification'], req);
      const userName = path(['session', 'user', 'name'], req);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);

      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        userName,
        newDesigns,
        returnUrl: req.originalUrl,
      };

      res.render('pages/login', {
        title: 'Login',
        notification,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  router.get('/logout', async (req, res, next) => {
    try {
      logger.info('GET /auth/logout');

      req.session = null;
      res.redirect(req.query.returnUrl);
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
