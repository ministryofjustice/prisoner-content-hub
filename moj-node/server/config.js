const { getEnv, isProduction, isTest } = require('../utils/index');

const hubEndpoint = getEnv('HUB_API_ENDPOINT', { requireInProduction: true });
const matomoUrl = getEnv('MATOMO_URL', { requireInProduction: true });
const backendUrl = getEnv('BACKEND_URL', 'http://hub-be:80');
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

module.exports = {
  appName: getEnv('APP_NAME', 'HMP Hub Local', {
    requireInProduction: true,
  }),
  dev: !isProduction && !isTest,
  test: isTest,
  production: isProduction,
  matomoUrl,
  backendUrl,
  cookieSecret: getEnv('COOKIE_SECRET', 'keyboard cat'),
  establishmentName: getEnv('ESTABLISHMENT_NAME', 'berwyn', {
    requireInProduction: true,
  }),
  hubEndpoint,
  ldap: {
    domain: getEnv('FQDN', 'MYDOMAIN'),
    domainController: `ldap://${getEnv('DOMAIN_CONTROLLER', 'myad.example')}`,
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
  apiV2: {
    hubContent: `${hubEndpoint}/v2/api/content`,
  },
  nomis: {
    clientToken: getEnv('NOMIS_API_TOKEN', 'ADD_ME'),
    api: {
      auth: `${nomisEndpoint}/auth/oauth/token?grant_type=client_credentials`,
      bookings: `${nomisEndpoint}/elite2api/api/bookings`,
    },
  },
  elasticsearch: {
    health: `${elasticSearchEndpoint}/_cluster/health?pretty`,
    search: `${elasticSearchEndpoint}/elasticsearch_index_hubdb_content_index/_search`,
  },
  matomoToken: getEnv('MATOMO_TOKEN', 'faketoken'),
  features: {
    newDesigns: getEnv('FEATURE_NEW_DESIGNS', false),
    prisonSwitch: getEnv('ENABLE_PRISON_SWITCH', false),
  },
  mockAuth: getEnv('MOCK_AUTH', 'false'),
};
