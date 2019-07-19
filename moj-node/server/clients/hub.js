const axios = require('axios');
const qs = require('querystring');
const logger = require('../../log');
const config = require('../config');

const { getEstablishmentId } = require('../utils');

class HubContentClient {
  constructor(client = axios) {
    this.client = client;
  }

  get(endpoint, { query, ...rest } = {}) {
    const newQuery = {
      _format: 'json',
      _lang: 'en',
      _prison: getEstablishmentId(config.establishmentName),
      ...query,
    };
    return this.client
      .get(endpoint, { params: newQuery, ...rest })
      .then(res => {
        logger.info(`Requested ${endpoint}?${qs.stringify(newQuery)}`);

        return res.data;
      })
      .catch(exp => {
        logger.info(`Failed to request ${endpoint}?${qs.stringify(newQuery)}`);
        logger.error(exp);
        return null;
      });
  }
}

module.exports = HubContentClient;
