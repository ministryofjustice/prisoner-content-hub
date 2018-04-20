require('dotenv').config();

const app = require('./server/index');
const log = require('./log');

app.listen(app.get('port'), () => {
  log.info(`Server listening on port ${app.get('port')}`);
});
