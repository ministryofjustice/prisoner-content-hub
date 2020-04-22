const { path } = require('ramda');
const express = require('express');

const createMoneyRouter = ({
  hubContentService,
  offenderService,
  analyticsService,
  logger,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const id = 4201;

    logger.info('GET /money');

    const userName = path(['session', 'user', 'name'], req);
    const bookingId = path(['session', 'user', 'bookingId'], req);

    const config = {
      content: true,
      header: false,
      postscript: true,
      detailsType: 'small',
      category: 'money',
      userName,
      returnUrl: req.originalUrl,
    };

    const establishmentId = path(['locals', 'establishmentId'], res);
    const sessionId = path(['session', 'id'], req);

    try {
      const balances = await offenderService.getBalancesFor(bookingId);
      const data = await hubContentService.contentFor(id, establishmentId);
      data.personalisedData = balances;
      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: '/money',
        title: 'Money and Debt',
        sessionId,
      });

      return res.render('pages/category', {
        title: 'Money and Debt',
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
  createMoneyRouter,
};
