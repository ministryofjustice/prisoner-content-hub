const { pathEq, prop, path } = require('ramda');

const statuses = {
  UP: 'UP',
  DOWN: 'DOWN',
  PARTIALLY_DEGRADED: 'PARTIALLY_DEGRADED',
};

function createHealthService({ client, config, logger }) {
  const { UP, DOWN, PARTIALLY_DEGRADED } = statuses;

  function allOk(...args) {
    const fn = s => s === UP;
    const all = args.every(fn);
    const some = args.some(fn);

    if (all) {
      return UP;
    }

    if (some) {
      return PARTIALLY_DEGRADED;
    }

    return DOWN;
  }

  async function getDrupalHealth() {
    const drupalUrl = path(['api', 'hubHealth'], config);
    const result = await client.get(drupalUrl);
    const isUp = pathEq(['db', 'status'], 'up');

    return {
      drupal: isUp(result) ? UP : DOWN,
    };
  }

  async function getElasticSearchHealth() {
    const elasticsearchUrl = path(['elasticsearch', 'health'], config);
    const result = await client.get(elasticsearchUrl);

    return {
      elasticsearch: prop('status', result) !== 'red' ? UP : DOWN,
    };
  }

  async function status() {
    try {
      const hubStatus = await getDrupalHealth();
      const elasticSearchStatus = await getElasticSearchHealth();

      return {
        status: allOk(hubStatus.drupal, elasticSearchStatus.elasticsearch),
        dependencies: {
          ...hubStatus,
          ...elasticSearchStatus,
        },
      };
    } catch (exp) {
      logger.error(exp);
      return {
        status: DOWN,
        dependencies: {
          drupal: DOWN,
          elasticsearch: DOWN,
        },
      };
    }
  }

  return { status };
}

module.exports = {
  statuses,
  createHealthService,
};
