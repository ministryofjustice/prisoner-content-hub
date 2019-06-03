const express = require('express');

module.exports = function createMeRouter({ logger, nomisBookingService }) {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/:offenderNo?', async (req, res, next) => {
    logger.info('GET /me');

    try {
      const { offenderNo } = req.params;
      const result = await nomisBookingService.getIEPSummaryFor(
        offenderNo || 'G0653GG',
      );

      return res.render('pages/me', {
        data: {
          title: 'Me',
          data: JSON.stringify(result, null, 2),
        },
        config,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
