const request = require('superagent');
const logger = require('../../log');

class HubContentClient {
  constructor(client = request) {
    this.client = client;
  }

  get(endpoint, query = {}) {
    return this.client
      .get(endpoint)
      .query({ _format: 'json' })
      .query({ _lang: 'en' })
      .query(query)
      .then((res) => {
        logger.debug(`Requested ${endpoint}`);

        return res.body;
      })
      .catch((exp) => {
        logger.debug(`Requested ${endpoint} and got back`);
        logger.error(exp);
        return null;
      });
  }
}

module.exports = HubContentClient;
