const production = process.env.NODE_ENV === 'production';

function get(name, fallback, options = {}) {
  if (process.env[name]) {
    return process.env[name];
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback;
  }
  throw new Error(`Missing env var ${name}`);
}

const hubEndpoint = get('HUB_API_ENDPOINT', 'www.foo.com');

module.exports = {
  dev: !production,
  production,
  sessionSecret: get('SESSION_SECRET', 'app-insecure-default-session', { requireInProduction: true }),
  api: {
    hubContent: `${hubEndpoint}/content`,
    hubMenu: `${hubEndpoint}/menu`,
    hubTerm: `${hubEndpoint}/term`,
    series: `${hubEndpoint}/content/series`,
  },
};
