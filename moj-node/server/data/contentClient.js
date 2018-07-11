const request = require('superagent');
const logger = require('../../log.js');

module.exports = {
  getMenu: async () => {
    try {
      const result = await request
        .get('http://hub-be/api/menu_items/admin')
        .set('Content-Type', 'application/json')
        .query({ _format: 'json' });
      return result.body;
    } catch (error) {
      logger.error('Error: ', error.message);
      logger.error('Error: ', error.stack);
      throw error;
    }
  },
};
