const request = require('superagent');
const logger = require('../../log');
const config = require('../config');

class HubContentClient {
  constructor(client = request) {
    this.client = client;
  }

  get(endpoint, query) {
    const newQuery = {
      _format: 'json',
      _lang: 'en',
      _prison: config.establishmentId,
      ...query,
    };
    return this.client
      .get(endpoint)
      .query(newQuery)
      .then((res) => {
        logger.debug(`Requested ${endpoint}`, newQuery);

        return res.body;
      })
      .catch((exp) => {
        logger.debug(`Requested ${endpoint} and got back`, newQuery);
        logger.error(exp);
        return null;
      });
  }
}

module.exports = HubContentClient;
