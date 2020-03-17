const bunyan = require('bunyan');
const bunyanFormat = require('bunyan-format');

const config = require('./server/config');

const formatOut = bunyanFormat({ outputMode: 'short' });
const log = bunyan.createLogger({
  name: config.appName,
  stream: formatOut,
  level: 'debug',
});

module.exports = {
  logger: log,
};
