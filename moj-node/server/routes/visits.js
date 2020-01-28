const { path } = require('ramda');
const express = require('express');

module.exports = function createVisitsRouter({
  hubContentService,
  offenderService,
  logger,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const id = 4203;

    logger.info('GET /visits');

    const notification = path(['session', 'notification'], req);
    const userName = path(['session', 'user', 'name'], req);
    const bookingId = path(['session', 'user', 'bookingId'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);

    const config = {
      content: true,
      header: false,
      postscript: true,
      detailsType: 'small',
      category: 'visits',
      newDesigns,
      userName,
    };

    const establishmentId = path(
      ['app', 'locals', 'envVars', 'establishmentId'],
      req,
    );

    try {
      const visits = await offenderService.getVisitsFor(bookingId);
      const data = await hubContentService.contentFor(id, establishmentId);
      data.personalisedData = visits;

      return res.render('pages/category', {
        title: 'Visits',
        config,
        data,
        notification,
      });
    } catch (exp) {
      return next(exp);
    }
  });

  return router;
};
