const express = require('express');
const {
  FACILITY_LIST_CONTENT_IDS: facilitiesList,
} = require('../constants/hub');

const getFacilitiesListFor = id =>
  Object.prototype.hasOwnProperty.call(facilitiesList, id)
    ? facilitiesList[id]
    : '/404';

module.exports = function Index({ logger, hubFeaturedContentService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const { establishmentId } = req.app.locals.envVars;
      const { notification } = req.session;

      const featuredContent = await hubFeaturedContentService.hubFeaturedContent(
        { establishmentId },
      );

      const config = {
        content: true,
        header: true,
        postscript: true,
        newDesigns: res.locals.features.newDesigns,
        detailsType: 'large',
      };

      const popularTopics = {
        Visits: '/content/4203',
        Incentives: '/content/4204',
        Games: '/content/3621',
        Inspiration: '/content/3659',
        'Music & talk': '/content/3662',
        'PSIs & PSOs': '/tags/796',
        'Facilities list & catalogues': getFacilitiesListFor(establishmentId),
        'Healthy mind & body': '/content/3657',
        'Money & debt': '/content/4201',
      };

      res.render('pages/home', {
        notification,
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
