require('dotenv').config();

const app = require('./server/index');
const { logger } = require('./server/utils/logger');

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`);
});
