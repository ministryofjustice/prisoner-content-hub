const express = require('express');

module.exports = function Health({ appInfo }) {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    try {
      res.json({ status: 'OK', ...appInfo.getBuildInfo() });
    } catch (exp) {
      next(exp);
    }
  });

  return router;
};
