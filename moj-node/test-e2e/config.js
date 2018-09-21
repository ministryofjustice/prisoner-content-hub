const { getEnv } = require('../utils/index');

module.exports = {
  appURL: getEnv('HUB_APP_URL', 'http://localhost:3000'),
};
