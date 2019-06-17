const ntlm = require('express-ntlm');
const config = require('../config');
const logger = require('../../log');

module.exports = () => {
  if (config.mockAuth === 'true') {
    return (request, response, next) => {
      request.ntlm = {
        DomainName: 'MOCK_DOMAIN',
        UserName: request.query.mockUser || 'G0653GG',
        Workstation: 'MOCK_WORKSTATION',
      };
      next();
    };
  }
  return ntlm({
    debug(...args) {
      logger.debug(args);
    },
    domain: config.ldap.domain,
    domaincontroller: config.ldap.domainController,
    unauthorized: (request, response) => response.status(401).send(),
  });
};
