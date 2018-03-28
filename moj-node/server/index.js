const createApp = require('./app');
const logger = require('../log');

const createSomeService = require('./sevices/someService');

// pass in dependencies of service
const someService = createSomeService();

const app = createApp({
    logger,
    someService
});

module.exports = app;