const config = require('../../server/config');
const {
  authenticateUser,
  createUserSession,
} = require('../../server/middleware/auth');

describe('auth', () => {
  describe('.authMiddleware', () => {
    const originalConfig = { ...config };

    afterEach(() => {
      config.mockAuth = originalConfig.mockAuth;
    });

    describe('When configured to mock authentication', () => {
      it('should allow user to be mocked through query parameters', async () => {
        const next = sinon.spy();
        const middleware = authenticateUser({ config: { mockAuth: 'true' } });

        const request = { query: { mockUser: 'MOCK_USER' } };
        await middleware(request, {}, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(request.user).to.have.property('id', 'MOCK_USER');
      });

      it('should allow user to be stored in the session', async () => {
        const next = sinon.spy();
        const middleware = authenticateUser({ config: { mockAuth: 'true' } });

        const request = {
          query: {},
          session: { user: { offenderNo: 'MOCK_USER' } },
        };
        await middleware(request, {}, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(request.user).to.have.property('id', 'MOCK_USER');
      });
    });

    describe('When configured to NOT mock authentication', () => {
      it('should use LDAP', async () => {
        config.mockAuth = 'false';
        const next = sinon.spy();
        const mockLdap = sinon.stub().resolves({ sAMAccountName: 'MOCK_USER' });
        const middleware = authenticateUser({ authenticate: mockLdap });

        const request = { body: { username: 'MOCK', password: 'USER' } };
        await middleware(request, {}, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(mockLdap.called).to.equal(
          true,
          'mockLdap should have been called',
        );
        expect(request.user).to.have.property('id', 'MOCK_USER');
      });
    });
  });

  describe('.createUserSession', () => {
    describe('When there is a session', () => {
      it('should not change the session and call next', async () => {
        const session = { user: { offenderNo: 'TEST' } };
        const ntlm = { UserName: 'TEST' };
        const request = { session, ntlm };
        const response = { locals: {}, status: 200 };
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
        expect(response.locals.user).to.eql(
          request.session.user,
          'the user should have been added to locals',
        );
      });
    });
    describe('When the user is authenticated and there is no session', () => {
      it('should store the user in the session and call next', async () => {
        const session = {};
        const user = { id: 'TEST_USERNAME' };
        const request = { session, user };
        const response = { locals: {}, status: 200 };
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
        const response = { locals: {}, status: 404 };
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
        expect(next.called).to.equal(true, 'next should have been called');
      });
    });
  });
});
