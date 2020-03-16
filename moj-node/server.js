require('dotenv').config();

const app = require('./server/index');
const { logger } = require('./logger');

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`);
});
