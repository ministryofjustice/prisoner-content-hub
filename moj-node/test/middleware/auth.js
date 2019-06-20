const config = require('../../server/config');
const {
  authMiddleware,
  createUserSession,
} = require('../../server/middleware/auth');

describe('auth', () => {
  describe('.authMiddleware', () => {
    const originalConfig = { ...config };

    beforeEach(() => {
      config.mockAuth = originalConfig.mockAuth;
    });

    describe('When configured to mock authentication', () => {
      it('should not use NTLM', () => {
        config.mockAuth = 'true';
        const ntlm = sinon.spy();
        const next = sinon.spy();
        const middleware = authMiddleware(ntlm);

        expect(ntlm.called).to.equal(false, 'ntlm should have NOT been called');

        const request = { query: { mockUser: 'MOCK_USER' } };
        middleware(request, {}, next);

        expect(next.called).to.equal(true, 'next should have been called');
        expect(request.ntlm).to.have.property('UserName', 'MOCK_USER');
      });
    });

    describe('When configured to NOT mock authentication', () => {
      it('should use NTLM', () => {
        const ntlm = sinon.spy();
        authMiddleware(ntlm);

        expect(ntlm.called).to.equal(true, 'ntlm should have been called');
        expect(ntlm.lastCall.args[0]).to.have.property(
          'domain',
          config.ldap.domain,
        );
        expect(ntlm.lastCall.args[0]).to.have.property(
          'domaincontroller',
          config.ldap.domainController,
        );
      });
    });
  });

  describe('.createUserSession', () => {
    describe('When there is a session', () => {
      it('should not change the session and call next', async () => {
        const session = { user: 'TEST' };
        const ntlm = { UserName: 'CHANGED' };
        const request = { session, ntlm };
        const response = { locals: {} };
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
        expect(request.session.user).to.equal(
          'TEST',
          'the session should NOT have been changed',
        );
        expect(response.locals.user).to.equal(
          request.session.user,
          'the user should have been added to locals',
        );
      });
    });
    describe('When the user is authenticated and there is no session', () => {
      it('should store the user in the session and call next', async () => {
        const session = {};
        const ntlm = { UserName: 'TEST_USERNAME' };
        const request = { session, ntlm };
        const response = { locals: {} };
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
        const ntlm = { UserName: null };
        const request = { session, ntlm };
        const response = { locals: {} };
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
