const express = require('express');
const { path } = require('ramda');
const {
  FACILITY_LIST_CONTENT_IDS: facilitiesList,
} = require('../constants/hub');

const getFacilitiesListFor = id =>
  Object.prototype.hasOwnProperty.call(facilitiesList, id)
    ? facilitiesList[id]
    : '/404';

const createIndexRouter = ({
  logger,
  hubFeaturedContentService,
  analyticsService,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const userName = path(['session', 'user', 'name'], req);
      const establishmentId = path(['locals', 'establishmentId'], res);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);
      const sessionId = path(['session', 'id'], req);

      const featuredContent = await hubFeaturedContentService.hubFeaturedContent(
        { establishmentId },
      );

      const config = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        newDesigns,
        userName: userName ? `Hi, ${userName}` : null,
        establishmentId,
        returnUrl: req.originalUrl,
      };

      const popularTopics = {
        Coronavirus: '/tags/894',
        Visits: '/content/4203',
        // Incentives: '/content/4204',
        Games: '/content/3621',
        Inspiration: '/content/3659',
        'Music & talk': '/content/3662',
        'PSIs & PSOs': '/tags/796',
        'Facilities list & catalogues': getFacilitiesListFor(establishmentId),
        'Healthy mind & body': '/content/3657',
        // 'Money & debt': '/content/4201',
        Chaplaincy: '/tags/901',
      };
      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: '/',
        title: 'Home',
        sessionId,
      });

      res.render('pages/home', {
        config,
        popularTopics,
        featuredContent: featuredContent.featured[0],
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = {
  createIndexRouter,
};
