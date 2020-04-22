const { path } = require('ramda');
const express = require('express');

const createVisitsRouter = ({
  hubContentService,
  offenderService,
  analyticsService,
  logger,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const id = 4203;

    logger.info('GET /visits');

    const userName = path(['session', 'user', 'name'], req);
    const bookingId = path(['session', 'user', 'bookingId'], req);
    const sessionId = path(['session', 'id'], req);
    const config = {
      content: true,
      header: false,
      postscript: true,
      detailsType: 'small',
      category: 'visits',
      userName,
      returnUrl: req.originalUrl,
    };

    const establishmentId = path(['locals', 'establishmentId'], res);

    try {
      const visits = await offenderService.getVisitsFor(bookingId);
      const data = await hubContentService.contentFor(id, establishmentId);
      data.personalisedData = visits;
      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: '/visits',
        title: 'Visits',
        sessionId,
      });

      return res.render('pages/category', {
        title: 'Visits',
        config,
        data,
      });
    } catch (exp) {
      return next(exp);
    }
  });

  return router;
};

module.exports = {
  createVisitsRouter,
};
