const express = require('express');

module.exports = function ({logger, someService, SomeOtherService}) {
    const router = express.Router();

    router.get('/', (req, res) => {
        logger.info('GET index');

        const data = someService.getSomeData();

        res.render('index', {data})
    });

    return router;
};
