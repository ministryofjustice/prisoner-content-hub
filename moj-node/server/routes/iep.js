const { path } = require('ramda');
const express = require('express');

module.exports = function createIepRouter({
  hubContentService,
  offenderService,
  logger,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    const id = 4204;

    logger.info('GET /iep');

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
      category: 'iep',
    };

    const establishmentId = path(
      ['app', 'locals', 'envVars', 'establishmentId'],
      req,
    );

    try {
      const iep = await offenderService.getIEPSummaryFor(bookingId);
      const data = await hubContentService.contentFor(id, establishmentId);
      data.personalisedData = iep;

      return res.render('pages/category', {
        title: 'IEP',
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
