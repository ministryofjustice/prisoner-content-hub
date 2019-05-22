const request = require('superagent');
const config = require('../config');
const logger = require('../../log');

class NomisClient {
  constructor(client = request) {
    this.client = client;
  }

  get() {
    return this.client
      .post(config.nomis.api.auth)
      .set('Authorization', `Basic ${config.nomis.clientToken}`)
      .set('Accept', 'application/json')
      .set('Content-Length', 0)
      .then(res => {
        logger.debug(`Requested ${config.nomis.api.auth}`);

        return res.body;
      })
      .then(({ access_token: token }) => {
        return this.client
          .get(`${config.nomis.api.bookings}/G0653GG`)
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .then(res => {
            logger.debug(`${config.nomis.api.bookings}/G0653GG`);
            return res.body;
          });
      })
      .catch(exp => {
        logger.debug(`${config.nomis.api.bookings}/G0653GG`);

        logger.error(exp);
        return null;
      });
  }
}

module.exports = NomisClient;
