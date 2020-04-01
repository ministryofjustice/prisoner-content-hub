const qs = require('querystring');
const { baseClient } = require('./baseClient');
const { logger } = require('../../logger');

class StandardClient {
  constructor(client = baseClient) {
    this.client = client;
  }

  get(endpoint, { query, ...rest } = {}) {
    return this.client
      .get(endpoint, { params: query, ...rest })
      .then(res => {
        logger.info(`Requested (GET) ${endpoint}?${qs.stringify(query)}`);

        return res.data;
      })
      .catch(exp => {
        logger.info(
          `Failed to request (GET) ${endpoint}?${qs.stringify(query)}`,
        );
        logger.error(exp);
        return null;
      });
  }

  post(endpoint, data) {
    return this.client
      .post(endpoint, data)
      .then(res => {
        logger.info(`Requested (POST) ${endpoint} with`, JSON.stringify(data));

        return res.data;
      })
      .catch(exp => {
        logger.info(
          `Failed to request (POST) ${endpoint} with`,
          JSON.stringify(data),
        );
        logger.error(exp);
        return null;
      });
  }

  postFormData(endpoint, data) {
    const querystring = Object.keys(data)
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');

    return this.client
      .post(endpoint, querystring, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      .then(res => {
        logger.info(
          `Requested (POST URLENCODED) ${endpoint} with`,
          querystring,
        );

        return res.data;
      })
      .catch(exp => {
        logger.info(
          `Failed to request (POST URLENCODED) ${endpoint} with`,
          querystring,
        );
        logger.error(exp);

        return null;
      });
  }
}

module.exports = {
  StandardClient,
};
