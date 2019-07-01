const request = require('superagent');
const logger = require('../../log');

class StandardClient {
  constructor(client = request) {
    this.client = client;
  }

  get(endpoint, query) {
    return this.client
      .get(endpoint)
      .query(query)
      .then(res => {
        logger.info(`Requested ${endpoint}`, query);

        return res;
      })
      .catch(exp => {
        logger.info(`Failed to request ${endpoint} and got back`, query);
        logger.error(exp);
        return null;
      });
  }

  post(endpoint, data) {
    return this.client
      .post(endpoint)
      .send(data)
      .then(res => {
        logger.info(`Requested ${endpoint}`, JSON.stringify(data));

        return res;
      })
      .catch(exp => {
        logger.info(
          `Failed to request ${endpoint} and got back`,
          JSON.stringify(data),
        );
        logger.error(exp);
        return null;
      });
  }
}

module.exports = StandardClient;
