const express = require('express');

module.exports = function Health({ appInfo, healthService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const healthStatus = await healthService.status();

      res.json({
        ...appInfo.getBuildInfo(),
        ...healthStatus,
      });
    } catch (exp) {
      next(exp);
    }
  });

  return router;
};
