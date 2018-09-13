const bunyan = require('bunyan');
const bunyanFormat = require('bunyan-format');

const formatOut = bunyanFormat({ outputMode: 'short' });

const log = bunyan.createLogger({ name: 'The Hub app', stream: formatOut, level: 'debug' });

module.exports = log;
