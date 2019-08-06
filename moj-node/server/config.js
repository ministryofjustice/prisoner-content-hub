const { getEnv, isProduction, isTest } = require('../utils/index');

const hubEndpoint = getEnv('HUB_API_ENDPOINT', { requireInProduction: true });
const matomoUrl = getEnv('MATOMO_URL', { requireInProduction: true });
const matomoEndpoint = getEnv('MATOMO_API_URI', { requireInProduction: true });
const nomisEndpoint = getEnv('NOMIS_API_ENDPOINT', 'https://api.nomis', {
  requireInProduction: true,
});
const elasticSearchEndpoint = getEnv(
  'ELASTICSEARCH_ENDPOINT',
  'http://localhost:9200',
  {
    requireInProduction: true,
  },
);
const nomisAPIEndpoint = `${nomisEndpoint}/elite2api/api`;

module.exports = {
  appName: getEnv('APP_NAME', 'HMP Hub Local', {
    requireInProduction: true,
  }),
  featureTogglesEnabled: getEnv('ENABLE_FEATURE_TOGGLES', 'true'),
  dev: !isProduction && !isTest,
  test: isTest,
  production: isProduction,
  matomoUrl,
  cookieSecret: getEnv('COOKIE_SECRET', 'keyboard cat'),
  establishmentName: getEnv('ESTABLISHMENT_NAME', 'berwyn'),
  hubEndpoint,
  ldap: {
    domain: getEnv('FQDN', 'MYDOMAIN'),
    domainController: `ldap://${getEnv('FQDN', 'myad.example')}`,
  },
  api: {
    matomo: `${matomoEndpoint}/index.php`,
    hubHealth: `${hubEndpoint}/api/health`,
    hubContent: `${hubEndpoint}/v1/api/content`,
    hubCategory: `${hubEndpoint}/v1/api/category`,
    hubMenu: `${hubEndpoint}/v1/api/menu`,
    categoryMenu: `${hubEndpoint}/v1/api/category-menu`,
    hubTerm: `${hubEndpoint}/v1/api/term`,
    series: `${hubEndpoint}/v1/api/content/series`,
    tags: `${hubEndpoint}/v1/api/vocabulary/tags`,
  },
  nomis: {
    clientToken: getEnv('NOMIS_API_TOKEN', 'ADD_ME'),
    api: {
      auth: `${nomisEndpoint}/auth/oauth/token?grant_type=client_credentials`,
      bookings: `${nomisAPIEndpoint}/bookings`,
    },
  },
  elasticsearch: {
    health: `${elasticSearchEndpoint}/_cluster/health?pretty`,
    search: `${elasticSearchEndpoint}/elasticsearch_index_hubdb_content_index/_search`,
  },
  matomoToken: getEnv('MATOMO_TOKEN', 'faketoken'),
  features: ['showPageMenu', 'showBrowseByTopics'],
  enablePrisonSwitch: getEnv('ENABLE_PRISON_SWITCH', 'false'),
  mockAuth: getEnv('MOCK_AUTH', 'false'),
};
