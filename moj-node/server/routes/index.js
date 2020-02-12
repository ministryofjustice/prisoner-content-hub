const express = require('express');
const { path } = require('ramda');
const { authenticate } = require('ldap-authentication');
const {
  FACILITY_LIST_CONTENT_IDS: facilitiesList,
} = require('../constants/hub');

const getFacilitiesListFor = id =>
  Object.prototype.hasOwnProperty.call(facilitiesList, id)
    ? facilitiesList[id]
    : '/404';

const getLdapUser = async (username, password, config, logger) => {
  const options = {
    ldapOpts: {
      url: config.url,
      // tlsOptions: {
      //   ca: [fs.readFileSync('mycacert.pem')]
      // }
    },
    adminDn: config.adminDn,
    adminPassword: config.adminPassword,
    userPassword: password,
    userSearchBase: config.userSearchBase,
    usernameAttribute: 'cn',
    username,
    // starttls: true
  };

  try {
    logger.info(`LDAP: Requesting authentication for user ${username}`);
    const ldap = await authenticate(options);

    logger.info('LDAP: Authentication successful');

    return path(['sAMAccountName'], ldap);
  } catch (e) {
    logger.error(`LDAP: Authentication failed: ${e.message}`);
    return new Error();
  }
};

module.exports = function Index({ logger, hubFeaturedContentService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const notification = path(['session', 'notification'], req);
      const userName = path(['session', 'user', 'name'], req);
      const establishmentId = path(['locals', 'establishmentId'], res);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);

      const featuredContent = await hubFeaturedContentService.hubFeaturedContent(
        { establishmentId },
      );

      const newUserName = getLdapUser(
        path(['query', 'uid'], req),
        path(['query', 'pwd'], req),
        path(['app', 'locals', 'ldap'], res),
        logger,
      );

      const config = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        newDesigns,
        userName,
        establishmentId,
        newUserName,
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
