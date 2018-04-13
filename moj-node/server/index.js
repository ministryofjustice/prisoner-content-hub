const createApp = require('./app');
const logger = require('../log');

const createSomeService = require('./services/someService');
const createMenuService = require('./services/menuService');


// pass in dependencies of service
const someService = createSomeService();
const menuService = createMenuService();

const app = createApp({
    logger,
    someService,
    menuService
});

module.exports = app;
