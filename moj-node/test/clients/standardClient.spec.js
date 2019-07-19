const nock = require('nock');
const StandardClient = require('../../server/clients/standard');

describe('StandardClient', () => {
  before(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('.get', () => {
    it('makes a request simple GET request', async () => {
      nock('https://some-api.com')
        .get('/')
        .query(false)
        .reply(200, ['SOME_DATA']);

      const client = new StandardClient();
      const result = await client.get('https://some-api.com');

      expect(result).to.eql(['SOME_DATA']);
    });

    it('makes a request simple GET request with a query', async () => {
      let reqPath;
      nock('https://some-api.com')
        .get('/')
        .query(true)
        .reply(200, function request() {
          reqPath = this.req.path;
          return ['SOME_FOO_BAR_DATA'];
        });

      const client = new StandardClient();
      const result = await client.get('https://some-api.com', {
        query: {
          foo: 'bar',
        },
      });

      expect(reqPath).to.include('foo=bar');
      expect(result).to.eql(['SOME_FOO_BAR_DATA']);
    });

    it('returns an null when the request fails', async () => {
      nock('https://some-api.com')
        .get('/bar')
        .reply(200, ['SOME_DATA']);

      const client = new StandardClient();
      const result = await client.get('https://some-api.com/invalid');

      expect(result).to.eql(null);
    });
  });

  describe('.post', () => {
    it('posts data to an endpoint', async () => {
      nock('https://www.example.com')
        .post('/foo', { foo: 'bar' })
        .reply(200, { id: '123ABC' });

      const client = new StandardClient();
      const result = await client.post('https://www.example.com/foo', {
        foo: 'bar',
      });

      expect(result).to.eql({ id: '123ABC' });
    });

    it('returns null when the request fails', async () => {
      nock('https://www.example.com')
        .post('/endpoint', { foo: 'bar' })
        .reply(500, { id: '123ABC' });

      const client = new StandardClient();
      const result = await client.post('https://www.example.com/bar', {
        foo: 'bar',
      });

      expect(result).to.eql(null);
    });
  });
});
