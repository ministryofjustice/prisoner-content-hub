const qs = require('querystring');
const { baseClient } = require('./baseClient');
const logger = require('../../log');

class StandardClient {
  constructor(client = baseClient) {
    this.client = client;
  }

  get(endpoint, { query, ...rest } = {}) {
    return this.client
      .get(endpoint, { params: query, ...rest })
      .then(res => {
        logger.info(`Requested ${endpoint}?${qs.stringify(query)}`);

        return res.data;
      })
      .catch(exp => {
        logger.info(`Failed to request ${endpoint}?${qs.stringify(query)}`);
        logger.error(exp);
        return null;
      });
  }

  post(endpoint, data) {
    return this.client
      .post(endpoint, data)
      .then(res => {
        logger.info(`Requested ${endpoint} with`, JSON.stringify(data));

        return res.data;
      })
      .catch(exp => {
        logger.info(`Failed to request ${endpoint} with`, JSON.stringify(data));
        logger.error(exp);
        return null;
      });
  }
}

module.exports = StandardClient;
