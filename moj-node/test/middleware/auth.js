const { LdapAuthenticationError } = require('ldap-authentication');
const config = require('../../server/config');
const {
  authenticateUser,
  createUserSession,
} = require('../../server/middleware/auth');

class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

describe('auth', () => {
  describe('.authMiddleware', () => {
    const originalConfig = { ...config };

    afterEach(() => {
      config.mockAuth = originalConfig.mockAuth;
    });

    describe('When configured to mock authentication', () => {
      it('should allow user to be mocked through query parameters', async () => {
        const next = sinon.spy();
        const middleware = authenticateUser({ mockAuth: true });

        const request = { query: { mockUser: 'A1234BC' } };
        await middleware(request, {}, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(request.user).to.have.property('id', 'A1234BC');
      });

      it('should allow user to be stored in the session', async () => {
        const next = sinon.spy();
        const middleware = authenticateUser({ mockAuth: true });

        const request = {
          query: {},
          session: { user: { offenderNo: 'A1234BC' } },
        };
        await middleware(request, {}, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(request.user).to.have.property('id', 'A1234BC');
      });
    });

    describe('When configured to NOT mock authentication', () => {
      it('should use LDAP', async () => {
        const next = sinon.spy();
        const mockLdap = sinon.stub().resolves({ sAMAccountName: 'A1234BC' });
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = {
          body: { username: 'A1234BC', password: 'USER' },
          session: {},
        };
        await middleware(request, {}, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(mockLdap.called).to.equal(
          true,
          'mockLdap should have been called',
        );
        expect(request.user).to.have.property('id', 'A1234BC');
      });
      it('should validate username and create error if invalid', async () => {
        const next = sinon.spy();
        const mockLdap = sinon.spy();
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = {
          body: { username: 'FOO BAR', password: 'password' },
          session: {},
        };
        const response = {
          redirect: sinon.spy(),
        };
        await middleware(request, response, next);

        expect(response.redirect.called).to.equal(
          true,
          'should have redirected',
        );
        expect(response.redirect.lastCall.args[0]).to.equal(
          '/auth/signin',
          'should have redirected to signin page',
        );
        expect(request.session.form.errors).to.have.property('username');
      });
      it('should validate password and create error if invalid', async () => {
        const next = sinon.spy();
        const mockLdap = sinon.spy();
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = {
          body: { username: 'A1234BC', password: '' },
          session: {},
        };
        const response = {
          redirect: sinon.spy(),
        };
        await middleware(request, response, next);

        expect(response.redirect.called).to.equal(
          true,
          'should have redirected',
        );
        expect(response.redirect.lastCall.args[0]).to.equal(
          '/auth/signin',
          'should have redirected to signin page',
        );
        expect(request.session.form.errors).to.have.property('password');
      });

      it('should create a system notification when LDAP fails', async () => {
        const next = sinon.spy();
        const mockLdap = sinon.stub().rejects('BOOM!');
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = {
          body: { username: 'A1234BC', password: 'password' },
          session: {},
        };
        const response = {
          redirect: sinon.spy(),
        };
        await middleware(request, response, next);

        expect(response.redirect.called).to.equal(
          true,
          'should have redirected',
        );
        expect(response.redirect.lastCall.args[0]).to.equal(
          '/auth/signin',
          'should have redirected to signin page',
        );
        expect(request.session.form.errors).to.have.property('ldap');
      });

      it('should create a form error when the username is incorrect', async () => {
        const next = sinon.spy();
        const mockLdap = sinon
          .stub()
          .rejects(new LdapAuthenticationError('BOOM!'));
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = {
          body: { username: 'A1234BC', password: 'password' },
          session: {},
        };
        const response = {
          redirect: sinon.spy(),
        };
        await middleware(request, response, next);

        expect(response.redirect.called).to.equal(
          true,
          'should have redirected',
        );
        expect(response.redirect.lastCall.args[0]).to.equal(
          '/auth/signin',
          'should have redirected to signin page',
        );
        expect(request.session.form.errors).to.have.property('ldap');
      });
      it('should create a form error when the password is incorrect', async () => {
        const next = sinon.spy();
        const mockLdap = sinon
          .stub()
          .rejects(new InvalidCredentialsError('BOOM!'));
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = {
          body: { username: 'A1234BC', password: 'password' },
          session: {},
        };
        const response = {
          redirect: sinon.spy(),
        };
        await middleware(request, response, next);

        expect(response.redirect.called).to.equal(
          true,
          'should have redirected',
        );
        expect(response.redirect.lastCall.args[0]).to.equal(
          '/auth/signin',
          'should have redirected to signin page',
        );
        expect(request.session.form.errors).to.have.property('ldap');
      });

      it('should count the number of remaining sign in attempts', async () => {
        const next = sinon.spy();
        const mockLdap = sinon
          .stub()
          .rejects(new InvalidCredentialsError('BOOM!'));
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = {
          body: { username: 'A1234BC', password: 'password' },
          session: {},
        };
        const response = {
          redirect: sinon.spy(),
        };
        await middleware(request, response, next);
        expect(request.session.signInAttemptsRemaining).to.eql(
          4,
          `should have decremented (4)`,
        );
        await middleware(request, response, next);
        expect(request.session.signInAttemptsRemaining).to.eql(
          3,
          `should have decremented (3)`,
        );
        await middleware(request, response, next);
        expect(request.session.signInAttemptsRemaining).to.eql(
          2,
          `should have decremented (2)`,
        );
        await middleware(request, response, next);
        expect(request.session.signInAttemptsRemaining).to.eql(
          1,
          `should have decremented (1)`,
        );
        await middleware(request, response, next);
        expect(request.session.signInAttemptsRemaining).to.eql(
          5,
          `should have reset`,
        );
      });

      it('should disable sign in after 5 attempts for 5 minutes', async () => {
        const next = sinon.spy();
        const mockLdap = sinon
          .stub()
          .rejects(new InvalidCredentialsError('BOOM!'));

        const FIVE_MINUTES = 5 * 60 * 1000;
        const SIX_MINUTES = 6 * 60 * 1000;
        const now = new Date().getTime();
        const mockGetCurrentTime = sinon.stub();
        mockGetCurrentTime.returns(now);
        const middleware = authenticateUser({
          authenticate: mockLdap,
          getCurrentTime: mockGetCurrentTime,
        });

        const request = {
          body: { username: 'A1234BC', password: 'password' },
          session: {},
        };
        const response = {
          redirect: sinon.spy(),
        };
        await middleware(request, response, next);
        await middleware(request, response, next);
        await middleware(request, response, next);
        await middleware(request, response, next);
        await middleware(request, response, next);
        expect(mockLdap.callCount).to.equal(
          5,
          'mockLdap should have been called 5 times',
        );
        expect(request.session.signInDisabledUntilTime).to.eql(
          now + FIVE_MINUTES,
          `should have disabled account until 5 minutes from now`,
        );

        await middleware(request, response, next);
        expect(Object.keys(request.session.form.errors).length).to.eql(1);
        expect(mockLdap.callCount).to.equal(
          5,
          'mockLdap should not have been called',
        );

        mockGetCurrentTime.returns(now + SIX_MINUTES);
        await middleware(request, response, next);
        expect(mockLdap.callCount).to.equal(
          6,
          'mockLdap should have been called again',
        );
      });
    });
  });

  describe('.createUserSession', () => {
    describe('When there is a session', () => {
      it('should not change the session and call next', async () => {
        const session = { user: { offenderNo: 'TEST' } };
        const request = { session, user: { id: 'TEST' } };
        const response = { locals: {}, status: 200, redirect: sinon.spy() };
        const next = sinon.spy();
        const offenderService = {
          getOffenderDetailsFor: sinon.spy(),
        };

        const middleware = createUserSession({ offenderService });

        await middleware(request, response, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(offenderService.getOffenderDetailsFor.called).to.equal(
          false,
          'offenderService should NOT have been called',
        );
        expect(request.session.user.offenderNo).to.equal(
          'TEST',
          'the session should NOT have been changed',
        );
      });
    });
    describe('When the user is authenticated and there is no session', () => {
      it('should store the user in the session and call next', async () => {
        const session = {};
        const user = { id: 'TEST_USERNAME' };
        const request = { session, user };
        const response = { locals: {}, status: 200, redirect: sinon.spy() };
        const next = sinon.spy();
        const offenderService = {
          getOffenderDetailsFor: sinon.stub().resolves({
            bookingId: '123456',
            offenderId: 'qwerty',
            name: 'HE MAN',
          }),
        };

        const middleware = createUserSession({ offenderService });

        await middleware(request, response, next);

        expect(offenderService.getOffenderDetailsFor.called).to.equal(
          true,
          'offenderService.getOffenderDetailsFor should have been called',
        );
        expect(offenderService.getOffenderDetailsFor.lastCall.args[0]).to.equal(
          'TEST_USERNAME',
        );
        expect(request.session.user).to.have.property('name', 'HE MAN');
        expect(response.locals.user).to.have.property('name', 'HE MAN');
        expect(next.called).to.equal(true, 'next should have been called');
      });
    });
    describe('When there is no offender number', () => {
      it('should invalidate the session', async () => {
        const session = { user: 'TEST' };
        const user = { id: null };
        const request = { session, user };
        const redirect = sinon.spy();
        const response = { locals: {}, status: 404, redirect };
        const next = sinon.spy();
        const offenderService = {
          getOffenderDetailsFor: sinon.spy(),
        };

        const middleware = createUserSession({ offenderService });

        await middleware(request, response, next);

        expect(offenderService.getOffenderDetailsFor.called).to.equal(
          false,
          'offenderService.getOffenderDetailsFor should NOT have been called',
        );
        expect(request.session.user).to.equal(
          undefined,
          'there should be no user in the session',
        );
        expect(response.locals.user).to.equal(
          undefined,
          'there should be no user in locals',
        );
        expect(redirect.called).to.equal(
          true,
          'redirect should have been called',
        );
      });
    });
  });
});
