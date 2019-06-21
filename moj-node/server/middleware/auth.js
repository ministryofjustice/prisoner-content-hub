const expressNTLM = require('express-ntlm');
const { path } = require('ramda');
const config = require('../config');
const logger = require('../../log');

const offenderNumber = path(['user', 'offenderNo']);

module.exports.authMiddleware = (ntlm = expressNTLM) => {
  if (config.mockAuth === 'true') {
    return (request, response, next) => {
      request.ntlm = {
        DomainName: 'MOCK_DOMAIN',
        UserName:
          request.query.mockUser ||
          offenderNumber(request.session) ||
          'G9542VP',
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
    unauthorized: (request, response, next) => {
      logger.error('Failed to authenticate');
      next();
    },
  });
};

module.exports.createUserSession = ({ offenderService }) => {
  return async (request, response, next) => {
    try {
      const offenderNo = request.ntlm.UserName;

      if (offenderNo && !request.session.user) {
        const offenderDetails = await offenderService.getOffenderDetailsFor(
          offenderNo,
        );
        request.session.user = offenderDetails;
      } else if (
        !offenderNo ||
        offenderNo !== offenderNumber(request.session)
      ) {
        delete request.session.user;
      }
    } catch (error) {
      logger.error(error);
    } finally {
      response.locals.user = request.session.user;
      next();
    }
  };
};
