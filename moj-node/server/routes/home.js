const express = require('express');
const { path } = require('ramda');

module.exports = function Home({
  logger,
  offenderService,
  hubFeaturedContentService,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET home');

      const { notification } = req.session;
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);
      const { establishmentId } = req.app.locals.envVars;

      const [{ todaysEvents, isTomorrow }, featuredContent] = await Promise.all(
        [
          offenderService.getEventsForToday(bookingId),
          hubFeaturedContentService.hubFeaturedContent({ establishmentId }),
        ],
      );

      const config = {
        content: true,
        header: true,
        postscript: true,
        newDesigns: res.locals.features.newDesigns,
        detailsType: 'large',
        userName: path(['name'], userDetails),
      };

      const popularTopics = {
        Visits: '/content/3632',
        IEP: '/content/3663',
        Timetable: '/timetable',
        'Money and debt': '/content/3657',
        Games: '/content/3699',
        Music: '/content/3662',
        Facilities: '/content/3862',
        'PSIs and PSOs': '/tags/796',
        Catalogues: '/content/3658',
      };

      res.render('pages/home', {
        notification,
        config,
        todaysEvents,
        isTomorrow,
        popularTopics,
        featuredContent: featuredContent.featured[0],
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
