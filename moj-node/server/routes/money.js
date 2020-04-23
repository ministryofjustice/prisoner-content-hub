const { path } = require('ramda');
const express = require('express');

const createMoneyRouter = ({ hubContentService, offenderService, logger }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const id = 4201;

    logger.info('GET /money');

    const userName = path(['session', 'user', 'name'], req);
    const bookingId = path(['session', 'user', 'bookingId'], req);
    const establishmentId = path(['locals', 'establishmentId'], res);
    const config = {
      content: true,
      header: false,
      postscript: true,
      detailsType: 'small',
      category: 'money',
      userName,
      returnUrl: req.originalUrl,
    };

    try {
      const balances = await offenderService.getBalancesFor(bookingId);
      const data = await hubContentService.contentFor(id, establishmentId);
      data.personalisedData = balances;

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
