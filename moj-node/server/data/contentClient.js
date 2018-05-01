const logger = require('../../log.js');
const request = require('superagent');

module.exports = {

  getMenu: async () => {
    try {
      const result = await request
        .get('http://localhost:8182/api/menu_items/admin')
        .set('Content-Type', 'application/json')
        .query({ _format: 'json' });
      return result.body;
    } catch (error) {
      logger.error('Error: ', error.stack);
      throw error;
    }
  },
};
