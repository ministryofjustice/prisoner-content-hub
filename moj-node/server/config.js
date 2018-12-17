const {
  getEnv,
  isProduction,
  isTest,
} = require('../utils/index');

const { getEstablishmentId } = require('./utils');

const hubEndpoint = getEnv('HUB_API_ENDPOINT', { requireInProduction: true });
const drupalAppUrl = getEnv('DRUPAL_APP_URI', { requireInProduction: true });


module.exports = {
  appName: getEnv('APP_NAME', 'Test application', { requireInProduction: true }),
  dev: !isProduction && !isTest,
  test: isTest,
  production: isProduction,
  motamoUrl: getEnv('MATOMO_URL', { requireInProduction: true }),
  cookieSecret: getEnv('COOKIE_SECRET', 'keyboard cat'),
  establishmentId: getEstablishmentId(getEnv('ESTABLISHMENT_NAME', 'berwyn')),
  hubEndpoint,
  drupalAppUrl,
  api: {
    hubHealth: `${hubEndpoint}/api/health`,
    hubContent: `${hubEndpoint}/v1/api/content`,
    hubMenu: `${hubEndpoint}/v1/api/menu`,
    hubTerm: `${hubEndpoint}/v1/api/term`,
    series: `${hubEndpoint}/v1/api/content/series`,
    tags: `${hubEndpoint}/v1/api/vocabulary/tags`,
  },
  features: [
    'showLandingPageMenu',
    'showPageMenu',
    'showBrowseBySeries',
  ],
};
