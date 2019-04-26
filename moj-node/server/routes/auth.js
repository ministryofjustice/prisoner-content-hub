const ntlm = require('express-ntlm');
const express = require('express');
const config = require('../config');

module.exports = function createAuthRouter({ logger }) {
  const router = express.Router();

  router.use(
    ntlm({
      debug(...args) {
        console.log.apply(null, args); // eslint-disable-line no-console
      },
      domain: config.ldap.domain,
      domaincontroller: config.ldap.domainController,

      // use different port (default: 389)
      // domaincontroller: 'ldap://myad.example:3899',
    }),
  );

  router.get('/', (request, response) => {
    logger.info('GET /auth');
    response.end(JSON.stringify(request.ntlm)); // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
  });

  return router;
};
