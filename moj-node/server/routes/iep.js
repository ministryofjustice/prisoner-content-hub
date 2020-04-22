const { path } = require('ramda');
const express = require('express');

const createIepRouter = ({
  hubContentService,
  offenderService,
  analyticsService,
  logger,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const id = 4204;

    logger.info('GET /iep');

    const userName = path(['session', 'user', 'name'], req);
    const bookingId = path(['session', 'user', 'bookingId'], req);

    const config = {
      content: true,
      header: false,
      postscript: true,
      detailsType: 'small',
      category: 'iep',
      userName,
      returnUrl: req.originalUrl,
    };

    const establishmentId = path(['locals', 'establishmentId'], res);
    const sessionId = path(['session', 'id'], req);

    try {
      const iep = await offenderService.getIEPSummaryFor(bookingId);
      const data = await hubContentService.contentFor(id, establishmentId);
      data.personalisedData = iep;
      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: `/iep`,
        title: 'Incentives',
        sessionId,
      });

      return res.render('pages/category', {
        title: 'Incentives',
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
  createIepRouter,
};
