const retryAxios = require('retry-axios');
const { path } = require('ramda');
const { baseClient } = require('./baseClient');
const config = require('../config');
const logger = require('../../log');

function responseCodeFor(request) {
  return path(['response', 'status'], request);
}

class NomisClient {
  constructor(client = baseClient, token = null) {
    this.client = client;

    this.authToken = token;
    this.getAuthToken = this.getAuthToken.bind(this);
  }

  async getAuthToken() {
    const res = await this.client({
      url: config.nomis.api.auth,
      method: 'post',
      headers: {
        Authorization: `Basic ${config.nomis.clientToken}`,
        Accept: 'application/json',
        'Content-Length': 0,
      },
    });
    logger.info(`Requested ${config.nomis.api.auth}`);
    const token = path(['data', 'access_token'], res);
    this.authToken = token;
    return token;
  }

  async makeGetRequest(url) {
    logger.info(`Requested ${url}`);

    const client = this.client.create();
    retryAxios.attach(client);

    const res = await client({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        Accept: 'application/json',
      },
      raxConfig: {
        instance: client,
        statusCodesToRetry: [
          [100, 199],
          [401, 401],
          [429, 429],
          [500, 599],
        ],
        onRetryAttempt: async originalRequest => {
          const retryConfig = retryAxios.getConfig(originalRequest);
          const requestConfig = originalRequest.config;

          logger.info(`Retry attempt #${retryConfig.currentRetryAttempt}`);

          if (responseCodeFor(originalRequest) === 401) {
            const authToken = await this.getAuthToken();
            if (authToken) {
              // prettier-ignore
              requestConfig.headers.Authorization = `Bearer ${authToken}`;
            }
          }
        },
      },
    });

    return res.data;
  }

  async get(url) {
    if (!this.authToken) {
      await this.getAuthToken();
    }

    return this.makeGetRequest(url);
  }
}

module.exports = NomisClient;
