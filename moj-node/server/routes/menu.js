const express = require('express');

module.exports = function menu({ logger, menuService }) {
  const router = express.Router();

  router.get('/', async (request, response) => {
    logger.info('GET menu');
    const data = await menuService.getMenuElement();
    response.render('pages/menu', { data });
  });
  return router;
};
