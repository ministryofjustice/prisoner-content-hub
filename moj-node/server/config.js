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

const hubEndpoint = get('HUB_API_ENDPOINT', { requireInProduction: true });

module.exports = {
  dev: !production,
  production,
  api: {
    hubContent: `${hubEndpoint}/content`,
    hubMenu: `${hubEndpoint}/menu`,
    hubTerm: `${hubEndpoint}/term`,
    series: `${hubEndpoint}/content/series`,
  },
};
