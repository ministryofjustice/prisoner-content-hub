const express = require('express');

const createHealthRouter = ({ appInfo, healthService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const healthStatus = await healthService.status();
      res.set('Content-Language', 'en-GB');
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

module.exports = {
  createHealthRouter,
};
