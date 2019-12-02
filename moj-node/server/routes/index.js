const express = require('express');
const { path } = require('ramda');
const {
  FACILITY_LIST_CONTENT_IDS: facilitiesList,
} = require('../constants/hub');

const getFacilitiesListFor = id =>
  Object.prototype.hasOwnProperty.call(facilitiesList, id)
    ? facilitiesList[id]
    : '/404';

module.exports = function Index({
  logger,
  offenderService,
  hubFeaturedContentService,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const notification = path(['session', 'notification'], req);
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);
      const establishmentId = path(
        ['app', 'locals', 'envVars', 'establishmentId'],
        req,
      );

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
        detailsType: 'large',
        userName: path(['name'], userDetails),
        establishmentId,
      };

      const popularTopics = {
        Visits: '/visits',
        IEP: '/iep',
        Games: '/content/3621',
        Inspiration: '/content/3659',
        'Music & talk': '/content/3662',
        'PSIs & PSOs': '/tags/796',
        'Facilities list & catalogues': getFacilitiesListFor(establishmentId),
        'Healthy mind & body': '/content/3657',
        'Money & debt': '/money',
      };

      res.render('pages/home', {
        notification,
        config,
        todaysEvents,
        isTomorrow,
        popularTopics,
        featuredContent: featuredContent.featured[0],
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
