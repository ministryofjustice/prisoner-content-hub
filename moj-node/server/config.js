const { getEnv, isProduction, isTest } = require('../utils/index');

const hubEndpoint = getEnv('HUB_API_ENDPOINT', { requireInProduction: true });
const backendUrl = getEnv('BACKEND_URL', 'http://hub-be:80');
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
  appName: getEnv('APP_NAME', `digital-hub-frontend`, {
    requireInProduction: true,
  }),
  dev: !isProduction && !isTest,
  test: isTest,
  production: isProduction,
  backendUrl,
  cookieSecret: getEnv('COOKIE_SECRET', 'keyboard cat'),
  establishmentName: getEnv('ESTABLISHMENT_NAME', 'berwyn', {
    requireInProduction: true,
  }),
  hubEndpoint,
  ldap: {
    url: getEnv('LDAP_URL', 'keyboard cat'),
    adminDn: getEnv('LDAP_ADMIN_DN', 'keyboard cat'),
    adminPassword: getEnv('LDAP_ADMIN_PWD', 'keyboard cat'),
    userSearchBase: getEnv('LDAP_USER_SEARCH_BASE', 'keyboard cat'),
    starttls: getEnv('LDAP_START_TLS', true),
    certPath: getEnv('LDAP_CERT_PATH', '/etc/ssl/ca-certificates.crt'),
    usernameAttribute: getEnv('LDAP_USERNAME_ATTRIBUTE', 'cn'),
  },
  api: {
    hubHealth: `${hubEndpoint}/api/health`,
    hubContent: `${hubEndpoint}/v1/api/content`,
    hubCategory: `${hubEndpoint}/v1/api/category`,
    hubMenu: `${hubEndpoint}/v1/api/menu`,
    categoryMenu: `${hubEndpoint}/v1/api/category-menu`,
    hubTerm: `${hubEndpoint}/v1/api/term`,
    series: `${hubEndpoint}/v1/api/content/series`,
    tags: `${hubEndpoint}/v1/api/vocabulary/tags`,
    primary: `${hubEndpoint}/jsonapi/node/landing_page?fields[node--landing_page]=title,field_moj_description,drupal_internal__nid,field_moj_prisons`,
  },
  apiV2: {
    hubContent: `${hubEndpoint}/v2/api/content`,
  },
  phone: {
    server: getEnv('PHONE_SERVER', { requireInProduction: true }),
    port: parseInt(getEnv('PHONE_PORT', { requireInProduction: true }), 10),
    passPhrase: getEnv('PHONE_PASSPHRASE', { requireInProduction: true }),
    iterations: parseInt(
      getEnv('PHONE_ITERATIONS', { requireInProduction: true }),
      10,
    ),
    salt: getEnv('PHONE_SALT', { requireInProduction: true }),
    initialisationVector: getEnv('PHONE_IV', { requireInProduction: true }),
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
  features: {
    newDesigns: getEnv('FEATURE_NEW_DESIGNS', false),
    prisonSwitch: getEnv('ENABLE_PRISON_SWITCH', false),
  },
  mockAuth: getEnv('MOCK_AUTH', 'false') === 'true',
  analytics: {
    endpoint: getEnv(
      'ANALYTICS_ENDPOINT',
      'https://www.google-analytics.com/collect',
    ),
    siteId: getEnv('ANALYTICS_SITE_ID', 'UA-152065860-4'),
  },
  feedback: {
    endpoint: getEnv(
      'FEEDBACK_URL',
      'http://localhost:9200/local-feedback/_doc',
      { requireInProduction: true },
    ),
  },
  npr: {
    stream: getEnv('NPR_STREAM', '/npr-stream'),
  },
};
