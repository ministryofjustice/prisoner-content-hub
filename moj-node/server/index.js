const createApp = require('./app');
const logger = require('../log');

const createSomeService = require('./sevices/someService');
const createSomeOtherService = require('./sevices/someOtherService');

// pass in dependencies of service
const someService = createSomeService();
const someOtherService = createSomeOtherService();

const app = createApp({
    logger,
    someService,
    someOtherService
});

module.exports = app;
