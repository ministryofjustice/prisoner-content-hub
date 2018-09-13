const { getEnv } = require('../utils/index');

const hubEndpoint = getEnv('HUB_API_ENDPOINT');
const appURL = getEnv('HUB_APP_URL', 'http://localhost:3000');

module.exports = {
  appURL,
  api: {
    hubHealth: `${hubEndpoint}/api/health`,
    hubContent: `${hubEndpoint}/v1/api/content`,
    hubMenu: `${hubEndpoint}/v1/api/menu`,
    hubTerm: `${hubEndpoint}/v1/api/term`,
    series: `${hubEndpoint}/v1/api/content/series`,
  },
};
