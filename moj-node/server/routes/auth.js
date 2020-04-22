const express = require('express');
const { path, pathOr } = require('ramda');

module.exports = function Login({
  logger,
  formParser,
  authenticateUser,
  createUserSession,
  analyticsService,
}) {
  const router = express.Router();

  router.post(
    '/signin',
    formParser,
    authenticateUser,
    createUserSession,
    (req, res) => {
      return res.redirect(req.body.returnUrl);
    },
  );

  router.get('/signin', async (req, res, next) => {
    try {
      logger.info('GET /auth/signin');

      const notification = path(['session', 'notification'], req);
      const userName = path(['session', 'user', 'name'], req);
      const form = pathOr({}, ['session', 'form'], req);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);
      const sessionId = path(['session', 'id'], req);

      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        userName,
        newDesigns,
        returnUrl: req.query.returnUrl || '/',
        hideBar: true,
      };

      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: '/auth/signin',
        title: 'Sign in',
        sessionId,
      });

      res.render('pages/signin', {
        title: 'Sign in',
        notification,
        config,
        form: {
          ...form,
          errorList: form.errors
            ? Object.values(form.errors).sort((a, b) =>
                a.position > b.position ? 1 : -1,
              )
            : [],
        },
      });

      delete req.session.form;
      delete req.session.notification;
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
