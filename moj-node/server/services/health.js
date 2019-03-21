const superagent = require('superagent');
const logger = require('../../log');
const config = require('../config');

module.exports = function createHealthService(client = superagent) {
  async function status() {
    try {
      logger.info('Requested', config.api.hubHealth);

      const hubStatus = await getDrupalHealth(client);
      const matomoStatus = await getMatomoHealth(client);

      return {
        status: allOk(hubStatus.drupal, matomoStatus.matomo),
        dependencies: {
          ...hubStatus,
          ...matomoStatus,
        },
      };
    } catch (exp) {
      logger.error(exp);
      return {
        status: 'DOWN',
        dependencies: {
          drupal: 'DOWN',
          matomo: 'DOWN',
        },
      };
    }
  }

  return { status };
};

function allOk(...args) {
  const fn = status => status === 'UP';
  const all = args.every(fn);
  const some = args.some(fn);

  if (all) {
    return 'UP';
  }

  if (some) {
    return 'PARTIALLY_DEGRADED';
  }

  return 'DOWN';
}

async function getDrupalHealth(client) {
  const result = await fetchData(client, config.api.hubHealth, {
    _format: 'json',
  });

  return {
    drupal: result.ok ? 'UP' : 'DOWN',
  };
}

async function getMatomoHealth(client) {
  const result = await fetchData(client, config.api.matomo, {
    module: 'API',
    method: 'API.getPiwikVersion',
    token_auth: config.matomoToken,
  });

  return {
    matomo: result.ok ? 'UP' : 'DOWN',
  };
}

async function fetchData(client, url, query = {}) {
  try {
    const result = await client.get(url).query(query);
    return result;
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      ok: false,
    };
  }
}
