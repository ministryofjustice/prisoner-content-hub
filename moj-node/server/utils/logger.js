const createLogger = require('bunyan-request-logger');

const config = require('../config');

const logger = createLogger({
  name: config.appName,
  level: config.production ? 'info' : 'debug',
});

module.exports = {
  logger,
};
