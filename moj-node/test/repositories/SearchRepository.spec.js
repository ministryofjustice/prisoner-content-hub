const searchRepository = require('../../server/repositories/search');

describe('searchRepository', () => {
  describe('#find', () => {
    describe('When called with a search query', () => {
      it('should return the results', async () => {
        const mockResults = [
          {
            _id: '1',
            _source: {
              title: ['First Item'],
              summary: ['First item summary'],
            },
          },
          {
            _id: '2',
            _source: {
              title: ['Second Item'],
              summary: ['Second item summary'],
            },
          },
          {
            _id: '3',
            _source: {
              title: ['Third Item'],
              summary: ['Third item summary'],
            },
          },
        ];

        const client = createClient({
          body: { hits: { hits: mockResults } },
        });

        const repository = searchRepository(client);

        const query = 'Test Query';

        const response = await repository.find({
          query,
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(client.post.lastCall.args[1]);

        expect(requestBody).to.include(
          query,
          'The request body should include the query',
        );

        expect(response.length).to.equal(
          mockResults.length,
          'The method should have returned the same number of results',
        );

        expect(response[0]).to.eql(
          {
            title: 'First Item',
            summary: 'First item summary',
            url: '/content/1',
          },
          'The method should have transformed the results',
        );
      });

      it('should filter by prison', async () => {
        const client = createClient({
          body: { hits: { hits: [] } },
        });

        const repository = searchRepository(client);

        const query = 'Test Query';

        await repository.find({
          query,
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(client.post.lastCall.args[1]);

        expect(requestBody).to.include(
          'HMP Development',
          'The request body should include the prison name',
        );
      });

      it('should set a default limit for the number of results', async () => {
        const client = createClient({
          body: { hits: { hits: [] } },
        });

        const repository = searchRepository(client);

        await repository.find({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = client.post.lastCall.args[1];

        expect(requestBody.size).to.equal(
          15,
          'The query should set a default limit of results',
        );
      });

      it('should handle a malformed response', async () => {
        const client = createClient({
          body: {},
        });

        const repository = searchRepository(client);

        const response = await repository.find({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        expect(response.length).to.equal(
          0,
          'The method should have returned an empty array',
        );
      });
    });
  });

  describe('#typeAhead', () => {
    describe('When called with a search query', () => {
      it('should return the results', async () => {
        const mockResults = [
          {
            _id: '1',
            _source: {
              title: ['First Item'],
              summary: ['First item summary'],
            },
          },
          {
            _id: '2',
            _source: {
              title: ['Second Item'],
              summary: ['Second item summary'],
            },
          },
          {
            _id: '3',
            _source: {
              title: ['Third Item'],
              summary: ['Third item summary'],
            },
          },
        ];

        const client = createClient({
          body: { hits: { hits: mockResults } },
        });

        const repository = searchRepository(client);

        const query = 'Test Query';

        const response = await repository.find({
          query,
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(client.post.lastCall.args[1]);

        expect(requestBody).to.include(
          query,
          'The request body should include the query',
        );

        expect(response.length).to.equal(
          mockResults.length,
          'The method should have returned the same number of results',
        );

        expect(response[0]).to.eql(
          {
            title: 'First Item',
            summary: 'First item summary',
            url: '/content/1',
          },
          'The method should have transformed the results',
        );
      });

      it('should filter by prison', async () => {
        const client = createClient({
          body: { hits: { hits: [] } },
        });

        const repository = searchRepository(client);

        const query = 'Test Query';

        await repository.typeAhead({
          query,
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(client.post.lastCall.args[1]);

        expect(requestBody).to.include(
          'HMP Development',
          'The request body should include the prison name',
        );
      });

      it('should set a default limit for the number of results', async () => {
        const client = createClient({
          body: { hits: { hits: [] } },
        });

        const repository = searchRepository(client);

        await repository.typeAhead({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = client.post.lastCall.args[1];

        expect(requestBody.size).to.equal(
          5,
          'The query should set a default limit of results',
        );
      });

      it('should handle a malformed response', async () => {
        const client = createClient({
          body: {},
        });

        const repository = searchRepository(client);

        const response = await repository.typeAhead({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post.callCount).to.equal(
          1,
          'The method should have performed a post using the client',
        );

        expect(response.length).to.equal(
          0,
          'The method should have returned an empty array',
        );
      });
    });
  });
});

const createClient = response => ({
  get: sinon.stub().resolves(response),
  post: sinon.stub().resolves(response),
});
