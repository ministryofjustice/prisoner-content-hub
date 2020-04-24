const { authenticate: ldapAuthentication } = require('ldap-authentication');
const { path } = require('ramda');
const { logger } = require('../utils/logger');

const retryAttempts = 5;
const retryCoolDownPeriod = 5 * 60 * 1000;

const getOffenderNumberFrom = path(['user', 'offenderNo']);

function minutesAndSecondsFrom(milliseconds) {
  const pluralize = (unit, quantity) =>
    quantity > 1 ? `${quantity} ${unit}s` : `${quantity} ${unit}`;
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return seconds > 60
    ? `${pluralize('minute', minutes)} ${
        remainingSeconds > 0 ? pluralize('second', remainingSeconds) : ''
      }`
    : pluralize('second', seconds);
}

const notifications = {
  userNotFound:
    'You are not signed in. Some services will not be available to you. If you think you should be signed in, please report this to a digital champion or send an app to IT.',
  systemError:
    'There is a technical problem and we cannot show your personal information. We know about this and are working to fix it. You can still use the rest of the Content Hub',
};

const formErrors = {
  invalidUsername: 'Enter a username in the correct format',
  invalidPassword: 'Enter a password in the correct format',
  invalidCredentials:
    'There is a problem with the username or password you have entered. Check and try again',
  accountProblem:
    'There is a problem with your account and we are unable to log you in',
  lockedOut: `Sign in has been disabled for ${minutesAndSecondsFrom(
    retryCoolDownPeriod,
  )}`,
  unhandledFailure: 'We are unable to log you in',
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

function createFormError(field, error, position = 0) {
  return { href: `#${field}`, text: error, position };
}

const authenticateUser = function authenticateUser({
  authenticate = ldapAuthentication,
  config = {},
  mockAuth = false,
  getCurrentTime = () => new Date().getTime(),
} = {}) {
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
      usernameAttribute: config.usernameAttribute,
      username,
      userPassword: password,
    };

    logger.info(`LDAP: Requesting authentication for user ${username}`);
    const ldap = await authenticate(options);

    logger.info('LDAP: Authentication successful');

    return path(['sAMAccountName'], ldap);
  }

  function handleFormSubmissionError(req, res, form, url = '/auth/signin') {
    req.session.form = form;
    return res.redirect(url);
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
    const { signInDisabledUntilTime } = req.session;

    const form = {
      data: {},
      errors: {},
    };

    const currentTime = getCurrentTime();

    if (signInDisabledUntilTime && currentTime < signInDisabledUntilTime) {
      const remainingTime = signInDisabledUntilTime - currentTime;
      form.errors = {
        ldap: createFormError(
          'username',
          `Sign in has been disabled, wait ${minutesAndSecondsFrom(
            remainingTime,
          )}`,
        ),
      };
      handleFormSubmissionError(req, res, form);
    }

    if (!isValidPassword(password)) {
      form.errors.password = createFormError(
        'password',
        formErrors.invalidPassword,
        1,
      );
    }

    if (!isValidUsername(username)) {
      form.errors.username = createFormError(
        'username',
        formErrors.invalidUsername,
        0,
      );
    }

    if (Object.keys(form.errors).length > 0) {
      return handleFormSubmissionError(req, res, form);
    }

    try {
      req.user = { id: await getLdapUser(username, password) };
      return next();
    } catch (error) {
      if (error.name === 'InvalidCredentialsError') {
        const { signInAttemptsRemaining = retryAttempts } = req.session;
        const updatedAttemptsRemaining = signInAttemptsRemaining - 1;
        if (updatedAttemptsRemaining === 0) {
          logger.error(
            `LDAP: AUTH_DISABLE_SIGN_IN: ${username}, ${error.message}`,
          );
          const retryPeriodFromNow = currentTime + retryCoolDownPeriod;
          req.session.signInAttemptsRemaining = retryAttempts;
          req.session.signInDisabledUntilTime = retryPeriodFromNow;
          form.errors.ldap = createFormError('username', formErrors.lockedOut);
        } else {
          req.session.signInAttemptsRemaining = updatedAttemptsRemaining;
          form.errors.ldap = createFormError(
            'username',
            formErrors.invalidCredentials,
          );
        }
      } else if (error.name === 'LdapAuthenticationError') {
        logger.error(`LDAP: AUTH_ACCOUNT_ERROR: ${username}, ${error.message}`);
        form.errors.ldap = createFormError(
          'username',
          formErrors.accountProblem,
        );
      } else {
        logger.error(
          `LDAP: UNHANDLED_AUTH_ERROR: ${username}, ${error.message}`,
        );
        form.errors.ldap = createFormError(
          'username',
          formErrors.unhandledFailure,
        );
      }
      return handleFormSubmissionError(req, res, form);
    }
  };
};

const createUserSession = function createUserSession({ offenderService }) {
  function deleteUserSessionAndRedirect(req, res) {
    delete req.session.user;
    return res.redirect('/auth/signin');
  }

  return async (req, res, next) => {
    try {
      const offenderNo = req.user.id;

      if (offenderNo && !req.session.user) {
        const offenderDetails = await offenderService.getOffenderDetailsFor(
          offenderNo,
        );
        req.session.user = offenderDetails;
        delete req.session.notification;
        res.locals.user = req.session.user;
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

        return deleteUserSessionAndRedirect(req, res);
      }
    } catch (error) {
      logger.error(error);
      const errorStatus = path(['response', 'status'], error);
      if (!errorStatus) {
        req.session.notification = createNotification(
          notifications.userNotFound,
        );
      } else if (errorStatus >= 500) {
        req.session.notification = createNotification(
          notifications.systemError,
        );
      } else if (errorStatus === 404) {
        req.session.notification = createNotification(
          notifications.userNotFound,
        );
      } else if (errorStatus >= 400) {
        req.session.notification = createNotification(
          notifications.systemError,
        );
      }

      return deleteUserSessionAndRedirect(req, res);
    }

    return next();
  };
};

module.exports = {
  content: {
    notifications,
    formErrors,
  },
  authenticateUser,
  createUserSession,
};
