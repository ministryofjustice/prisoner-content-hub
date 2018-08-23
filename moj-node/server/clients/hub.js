const request = require('superagent');

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
      .then(res => res.body)
      .catch(() => null);
  }
}

module.exports = HubContentClient;
