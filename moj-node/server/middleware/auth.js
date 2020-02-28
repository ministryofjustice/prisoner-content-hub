const { authenticate: ldapAuthentication } = require('ldap-authentication');
const { path } = require('ramda');
const logger = require('../../log');

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

function isValidUsername(username) {
  const pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);
  return pattern.test(username);
}

function isValidPassword(password) {
  return password ? typeof password === 'string' && password.length > 0 : false;
}

function createFormError(field, error) {
  return { href: `#${field}-error`, text: error };
}

module.exports.authenticateUser = ({
  authenticate = ldapAuthentication,
  config = {},
  mockAuth = false,
} = {}) => {
  async function getLdapUser(username, password) {
    const options = {
      ldapOpts: {
        url: config.url,
        tlsOptions: config.tlsOptions,
      },
      starttls: config.starttls === 'true',
      adminDn: config.adminDn,
      adminPassword: config.adminPassword,
      userSearchBase: config.userSearchBase,
      usernameAttribute: 'cn',
      username,
      userPassword: password,
    };

    logger.info(`LDAP: Requesting authentication for user ${username}`);
    const ldap = await authenticate(options);

    logger.info('LDAP: Authentication successful');

    return path(['sAMAccountName'], ldap);
  }

  if (mockAuth) {
    return (req, res, next) => {
      req.user = {
        id:
          path(['query', 'mockUser'], req) ||
          getOffenderNumberFrom(req.session) ||
          'G9542VP',
      };
      return next();
    };
  }

  return async (req, res, next) => {
    const { username, password } = req.body;

    const form = {
      data: { username, password },
      errors: {},
    };

    if (!isValidPassword(password)) {
      form.errors.password = createFormError(
        'password',
        'Enter a valid password',
      );
    }

    if (!isValidUsername(username)) {
      form.errors.username = createFormError(
        'username',
        'Enter a valid username',
      );
    }

    if (Object.keys(form.errors).length > 0) {
      req.session.form = form;
      return res.redirect('/auth/signin');
    }

    try {
      req.user = { id: await getLdapUser(username, password) };
      return next();
    } catch (error) {
      if (
        error.name === 'LdapAuthenticationError' ||
        error.name === 'InvalidCredentialsError'
      ) {
        form.errors.ldap = createFormError(
          'ldap',
          'Either your username or password is incorrect',
        );
      } else {
        logger.error(error.message);
        req.session.notification = createNotification(
          notificationContent.systemError,
        );
      }
      req.session.form = form;
      return res.redirect('/auth/signin');
    }
  };
};

module.exports.createUserSession = ({ offenderService }) => {
  return async (req, res, next) => {
    try {
      const offenderNo = req.user.id;

      if (offenderNo && !req.session.user) {
        const offenderDetails = await offenderService.getOffenderDetailsFor(
          offenderNo,
        );
        req.session.user = offenderDetails;
        delete req.session.notification;
      } else if (offenderNo !== getOffenderNumberFrom(req.session)) {
        const forwarded = path(['headers', 'x-forwarded-for'], req);
        const ip = forwarded
          ? forwarded.split(/, /)[0]
          : path(['connection', 'remoteAddress'], req);

        logger.warn(
          `(${ip}) Session closed, username did not match: ${offenderNo} => ${getOffenderNumberFrom(
            req.session,
          )}`,
        );
        delete req.session.user;
      }
    } catch (error) {
      logger.error(error);
      const errorStatus = path(['response', 'status'], error);
      if (!errorStatus) {
        req.session.notification = createNotification(
          notificationContent.userNotFound,
        );
      } else if (errorStatus >= 500) {
        req.session.notification = createNotification(
          notificationContent.systemError,
        );
      } else if (errorStatus === 404) {
        req.session.notification = createNotification(
          notificationContent.userNotFound,
        );
      } else if (errorStatus >= 400) {
        req.session.notification = createNotification(
          notificationContent.systemError,
        );
      }
    } finally {
      res.locals.user = req.session.user;
      next();
    }
  };
};
