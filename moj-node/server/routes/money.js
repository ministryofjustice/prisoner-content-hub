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
    const userDetails = path(['session', 'user'], req);
    const bookingId = path(['session', 'user', 'bookingId'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], req);

    const config = {
      content: true,
      header: false,
      postscript: true,
      newDesigns,
      detailsType: 'small',
      userName: path(['name'], userDetails),
      category: 'money',
    };

    const establishmentId = path(
      ['app', 'locals', 'envVars', 'establishmentId'],
      req,
    );

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
