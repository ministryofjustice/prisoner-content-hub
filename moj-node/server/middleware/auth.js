const expressNTLM = require('express-ntlm');
const { path } = require('ramda');
const config = require('../config');
const { logger } = require('../utils/logger');

const getOffenderNumberFrom = path(['user', 'offenderNo']);

const notificationContent = {
  userNotFound:
    'You are not signed in. Some services will not be available to you. If you think you should be signed in, please report this to a digital champion or send an app to IT.',
  systemError:
    'Sorry, there is a technical problem and some features might not be working. We know about this problem and are working to fix it. Please try again later.',
};

function createNotification(text) {
  return { text };
}

module.exports.authMiddleware = (ntlm = expressNTLM) => {
  if (config.mockAuth === 'true') {
    return (request, response, next) => {
      request.ntlm = {
        DomainName: 'MOCK_DOMAIN',
        UserName:
          request.query.mockUser ||
          getOffenderNumberFrom(request.session) ||
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
      } else if (offenderNo !== getOffenderNumberFrom(request.session)) {
        const forwarded = path(['headers', 'x-forwarded-for'], request);
        const ip = forwarded
          ? forwarded.split(/, /)[0]
          : path(['connection', 'remoteAddress'], request);

        logger.warn(
          `(${ip}) Session closed, username did not match: ${offenderNo} => ${getOffenderNumberFrom(
            request.session,
          )}`,
        );
        delete request.session.user;
      }
    } catch (error) {
      logger.error(error);
      const errorStatus = path(['response', 'status'], error);
      if (!errorStatus) {
        request.session.notification = createNotification(
          notificationContent.userNotFound,
        );
      } else if (errorStatus >= 500) {
        request.session.notification = createNotification(
          notificationContent.systemError,
        );
      } else if (errorStatus === 404) {
        request.session.notification = createNotification(
          notificationContent.userNotFound,
        );
      } else if (errorStatus >= 400) {
        request.session.notification = createNotification(
          notificationContent.systemError,
        );
      }
    } finally {
      response.locals.user = request.session.user;
      next();
    }
  };
};
