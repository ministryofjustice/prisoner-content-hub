const express = require('express');

module.exports = function ({logger, someService, someOtherService}) {
    const router = express.Router();

    router.get('/', (req, res) => {
        // logger.info('GET index');

        const data = someService.getSomeData();
        const dataOther = someOtherService.getSomeData();

        res.render('pages/index', {data, dataOther})
    });

    return router;
};
