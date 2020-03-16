const { path } = require('ramda');
const express = require('express');

module.exports = function createVisitsRouter({
  hubContentService,
  offenderService,
  logger,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const id = 4201;

    logger.info('GET /money');

    const notification = path(['session', 'notification'], req);
    const userName = path(['session', 'user', 'name'], req);
    const bookingId = path(['session', 'user', 'bookingId'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const matomoUrl = path(['app', 'locals', 'config', 'matomoUrl'], req);

    const config = {
      content: true,
      header: false,
      postscript: true,
      detailsType: 'small',
      category: 'money',
      newDesigns,
      userName,
      matomoUrl,
    };

    const establishmentId = path(['locals', 'establishmentId'], res);

    try {
      const balances = await offenderService.getBalancesFor(bookingId);
      const data = await hubContentService.contentFor(id, establishmentId);
      data.personalisedData = balances;

      return res.render('pages/category', {
        title: 'Money and Debt',
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
