const superagent = require('superagent');
const logger = require('../../log');
const config = require('../config');

module.exports = function createHealthService(client = superagent) {
  async function status() {
    try {
      logger.info('Requested', config.api.hubHealth);

      const hubHealthResponse = await client.get(`${config.api.hubHealth}?_format=json`);
      const hubStatus = hubHealthResponse.ok ? 'OK' : 'DOWN';

      return {
        status: hubStatus,
        dependencies: {
          hub: hubStatus,
        },
      };
    } catch (exp) {
      logger.error(exp);
      return {
        status: 'DOWN',
        dependencies: {
          hub: 'DOWN',
        },
      };
    }
  }


  return { status };
};
