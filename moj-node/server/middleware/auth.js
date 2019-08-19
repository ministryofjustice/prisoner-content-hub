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
        // 'invalid',
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
        delete request.session.notification;
      } else if (
        !offenderNo ||
        offenderNo !== offenderNumber(request.session)
      ) {
        delete request.session.user;
      }
    } catch (error) {
      logger.error(error);
      if (error.response.status === 404) {
        request.session.notification = {
          hasBeenSeen: false,
          text:
            'We were unable to log you in, some services may be unavailable',
        };
      }
    } finally {
      response.locals.user = request.session.user;
      next();
    }
  };
};
