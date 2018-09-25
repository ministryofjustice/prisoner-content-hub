const { getEnv, isProduction } = require('../utils/index');

const hubEndpoint = getEnv('HUB_API_ENDPOINT', { requireInProduction: true });

module.exports = {
  appName: getEnv('APP_NAME', 'Test application', { requireInProduction: true }),
  dev: !isProduction,
  production: isProduction,
  motamoUrl: getEnv('MATOMO_URL', { requireInProduction: true }),
  api: {
    hubHealth: `${hubEndpoint}/api/health`,
    hubContent: `${hubEndpoint}/v1/api/content`,
    hubMenu: `${hubEndpoint}/v1/api/menu`,
    hubTerm: `${hubEndpoint}/v1/api/term`,
    series: `${hubEndpoint}/v1/api/content/series`,
  },
};
