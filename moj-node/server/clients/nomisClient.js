const axios = require('axios');
const retryAxios = require('retry-axios');
const { path, prop } = require('ramda');
const config = require('../config');
const logger = require('../../log');

axios.defaults.adapter = require('axios/lib/adapters/http');

class NomisClient {
  constructor(client = axios, token = null) {
    this.client = client;

    this.authToken = token;
    this.getAuthToken = this.getAuthToken.bind(this);
  }

  async getAuthToken() {
    try {
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
      this.authToken = res.data;
      return res.data;
    } catch (exp) {
      logger.info(`Failed to request ${config.nomis.api.auth}`);
      logger.error(exp);

      this.authToken = null;
      return null;
    }
  }

  async makeGetRequest(url) {
    try {
      logger.info(`Requested ${url}`);

      const client = this.client.create();
      retryAxios.attach(client);

      const res = await client({
        method: 'GET',
        url,
        headers: {
          Authorization: `Bearer ${this.authToken.access_token}`,
          Accept: 'application/json',
        },
        raxConfig: {
          instance: client,
          statusCodesToRetry: [[401, 401], [500, 503]],
          onRetryAttempt: async originalRequest => {
            const retryConfig = retryAxios.getConfig(originalRequest);
            const requestConfig = originalRequest.config;

            logger.info(`Retry attempt #${retryConfig.currentRetryAttempt}`);

            if (originalRequest.response.status >= 500) {
              return Promise.resolve();
            }

            const authToken = await this.getAuthToken();

            if (prop('access_token', authToken)) {
              requestConfig.headers.Authorization = `Bearer ${
                authToken.access_token
              }`;
              return Promise.resolve();
            }

            return Promise.reject(new Error('Failed to get access token'));
          },
        },
      });
      return res.data;
    } catch (exp) {
      logger.error(exp);
      return null;
    }
  }

  async get(url) {
    if (!path(['authToken', 'access_token'], this)) {
      await this.getAuthToken();
    }

    return this.makeGetRequest(url);
  }
}

module.exports = NomisClient;
