const express = require('express');

module.exports = function ({logger, someOtherService}) {
    const router = express.Router();

    router.get('/', (req, res) => {
        logger.info('GET education');

        const data = someOtherService.getSomeData();

        res.render('index', {data})
    });

    return router;
};
