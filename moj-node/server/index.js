const createApp = require('./app');
const logger = require('../log');

const createSomeService = require('./sevices/someService');
const createOtherSomeService = require('./sevices/someOtherService');

// pass in dependencies of service
const someService = createSomeService();
const someService = createOtherSomeService();

const app = createApp({
    logger,
    someService,
    someService
});

module.exports = app;
