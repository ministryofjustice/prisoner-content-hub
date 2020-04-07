const nock = require('nock');
const { HubClient } = require('../../server/clients/hub');

describe('HubClient', () => {
  describe('.get', () => {
    it('makes a request simple GET request', async () => {
      nock('https://hub-api.com')
        .get('/')
        .query(true)
        .reply(200, ['SOME_FOO_BAR_DATA']);

      const client = new HubClient();
      const result = await client.get('https://hub-api.com');

      expect(result).to.eql(['SOME_FOO_BAR_DATA']);
    });

    it('makes a GET request with hub specific query params', async () => {
      let reqPath;

      nock('https://hub-api.com')
        .get('/')
        .query(true)
        .reply(200, function request() {
          reqPath = this.req.path;
          return ['SOME_FOO_BAR_DATA'];
        });

      const client = new HubClient();

      await client.get('https://hub-api.com');

      expect(reqPath).to.include('_format=json');
      expect(reqPath).to.include('_lang=en');
      expect(reqPath).to.include('_prison=792');
    });

    it('accepts additional query params', async () => {
      let reqPath;

      nock('https://hub-api.com')
        .get('/')
        .query(true)
        .reply(200, function request() {
          reqPath = this.req.path;
        });

      const client = new HubClient();

      await client.get('https://hub-api.com', { query: { foo: 'bar' } });

      expect(reqPath).to.include('_format=json');
      expect(reqPath).to.include('_lang=en');
      expect(reqPath).to.include('_prison=792');
      expect(reqPath).to.include('foo=bar');
    });

    it('returns an null when the request fails', async () => {
      nock('https://hub-api.com').get(/bar/).reply(404, ['SOME_DATA']);

      const client = new HubClient();
      const result = await client.get('https://hub-api.com/bar');

      expect(result).to.eql(null);
    });
  });
});
