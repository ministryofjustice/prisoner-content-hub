const nock = require('nock');
const { NomisClient } = require('../../server/clients/nomisClient');

describe('NomisClient', () => {
  before(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('#getAuthToken', () => {
    it('returns a auth token', async () => {
      const token = 'foo.bar.baz';

      nock('https://api.nomis')
        .post(/auth\/oauth/)
        .reply(200, function request() {
          expect(this.req.headers.authorization).to.match(/Basic .+/);
          expect(this.req.headers.accept).to.equal('application/json');

          return { access_token: 'foo.bar.baz' };
        });

      const client = new NomisClient();
      const result = await client.getAuthToken();

      expect(result).to.eql(token);
    });
  });

  describe('#get', () => {
    describe('When an API token is not available', () => {
      it('gets and authentication token then returns data', async () => {
        const token = 'TEST_TOKEN';
        const authSpy = sinon.spy();

        nock('https://api.nomis')
          .post(/auth\/oauth/)
          .reply(200, function request() {
            authSpy();
            return { access_token: token };
          })
          .get(/test/)
          .reply(200, function request() {
            expect(this.req.headers.authorization).to.equal(`Bearer ${token}`);
            return { foo: 'bar' };
          });

        const client = new NomisClient();
        const result = await client.get('https://api.nomis/test');

        expect(authSpy.callCount).to.equal(
          1,
          'It should call the auth endpoint once',
        );

        expect(result.foo).to.eql('bar');
      });
    });
    describe('When an API token is available', () => {
      it('returns the data using the existing token', async () => {
        const token = 'TEST_TOKEN';
        const authSpy = sinon.spy();

        nock('https://api.nomis')
          .post(/auth\/oauth/)
          .reply(200, function request() {
            authSpy();
            return { access_token: token };
          })
          .get(/test/)
          .reply(200, function request() {
            expect(this.req.headers.authorization).to.equal(`Bearer ${token}`);
            return { foo: 'bar' };
          });

        const client = new NomisClient(undefined, token);
        const result = await client.get('https://api.nomis/test');

        expect(authSpy.callCount).to.equal(
          0,
          'It should not call the auth endpoint',
        );

        expect(result.foo).to.eql('bar');
      });
    });

    describe('When a request gets a 401', () => {
      it('fetches a new token before returning the data', async () => {
        const token = 'NEW_ISSUED_TOKEN';

        const authSpy = sinon.spy();
        const apiSpy = sinon.spy();

        nock('https://api.nomis')
          .post(/auth\/oauth/)
          .reply(200, function request() {
            authSpy();
            return { access_token: token };
          })
          .get(/test/)
          .reply(401, function request() {
            apiSpy();
            expect(this.req.headers.authorization).to.equal(`Bearer foo.bar`);
            return null;
          })
          .get(/test/)
          .reply(200, function request() {
            apiSpy();
            expect(this.req.headers.authorization).to.equal(
              `Bearer ${token}`,
              'The token should have updated',
            );
            return { foo: 'bar' };
          });

        const client = new NomisClient(undefined, 'foo.bar');
        const result = await client.get('https://api.nomis/test');

        expect(authSpy.callCount).to.equal(
          1,
          'It should have called the auth once',
        );

        expect(apiSpy.callCount).to.equal(
          2,
          'It should have called the api twice',
        );

        expect(result.foo).to.eql('bar');
      });

      it('retries the request 3 times before failing', async () => {
        const authSpy = sinon.spy();
        const apiSpy = sinon.spy();

        nock('https://api.nomis')
          .post(/auth\/oauth/)
          .times(3)
          .reply(200, () => {
            authSpy();
            return { access_token: 'TEST' };
          })
          .get(/test/)
          .times(4)
          .reply(401, apiSpy);

        const client = new NomisClient(undefined, 'foo.bar');
        let response;
        try {
          response = await client.get('https://api.nomis/test');
        } catch (error) {
          expect(authSpy.callCount).to.equal(
            3,
            'It should have called the auth endpoint 3 times',
          );

          expect(apiSpy.callCount).to.equal(
            4,
            'It should have called the api endpoint 4 times',
          );
          expect(response).to.equal(undefined, 'Should not have returned data');
        }
      });
    });

    describe('When a request gets a 500', () => {
      it('does not refresh the token', async () => {
        const authSpy = sinon.spy();
        const apiSpy = sinon.spy();

        nock('https://api.nomis')
          .post(/auth\/oauth/)
          .times(2)
          .reply(200, authSpy)
          .get(/test/)
          .reply(500, apiSpy)
          .get(/test/)
          .reply(200, () => {
            apiSpy();
            return { foo: 'bar' };
          });

        const client = new NomisClient(undefined, 'foo.bar');
        let result;
        try {
          result = await client.get('https://api.nomis/test');
        } catch (e) {
          expect(true); // We require the catch block to avoid an unhandled rejection warning
        } finally {
          expect(authSpy.callCount).to.equal(
            0,
            'It should not refresh the token',
          );
          expect(apiSpy.callCount).to.equal(
            2,
            'It should have called the api endpoint twice',
          );
          expect(result).to.eql({ foo: 'bar' });
        }
      });
    });

    describe('When the authentication endpoint fails', () => {
      it('does not retry the original request', async () => {
        const authSpy = sinon.spy();
        const apiSpy = sinon.spy();

        nock('https://api.nomis')
          .post(/auth\/oauth/)
          .times(2)
          .reply(401, () => {
            authSpy();
            return null;
          })
          .get(/test/)
          .times(5)
          .reply(401, apiSpy);

        let result;
        const client = new NomisClient(undefined, 'foo.bar');
        try {
          result = await client.get('https://api.nomis/test');
        } catch (error) {
          expect(authSpy.callCount).to.equal(
            1,
            'It should have called the auth endpoint once',
          );

          expect(apiSpy.callCount).to.equal(
            1,
            'It should have called the api endpoint once',
          );
          expect(result).to.equal(undefined, 'Should not have returned data');
        }
      });
    });
  });
});
