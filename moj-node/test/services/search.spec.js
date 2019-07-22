const createSearchService = require('../../server/services/search');

describe('SearchService', () => {
  describe('#find', () => {
    it('returns search results', async () => {
      const searchRepository = {
        find: sinon.stub().resolves(['result_1', 'result_2', 'result_3']),
      };
      const getEstablishmentName = sinon.stub().returns('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const result = await service.find({
        query: 'Test Query',
        establishmentId: 123,
        limit: 10,
        from: 5,
      });

      expect(searchRepository.find.callCount).to.equal(
        1,
        'The repository should have been called',
      );

      expect(searchRepository.find.lastCall.args[0]).to.eql(
        {
          query: 'Test Query',
          prison: 'HMP Development',
          limit: 10,
          from: 5,
        },
        'The repository should have been called with the correct arguments',
      );

      expect(getEstablishmentName.callCount).to.equal(
        1,
        'The service should get the establishment name',
      );

      expect(getEstablishmentName.lastCall.args[0]).to.eql(123);

      expect(Array.isArray(result)).to.equal(
        true,
        'The service should return an array of results',
      );
    });

    it('returns empty when there is no query', async () => {
      const searchRepository = {
        find: sinon.spy(),
      };
      const getEstablishmentName = sinon.stub().returns('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const results = await service.find({
        query: '',
        establishmentId: 123,
        limit: 10,
        from: 5,
      });

      expect(Array.isArray(results)).to.equal(
        true,
        'The method should return an array',
      );

      expect(results.length).to.equal(0, 'The array should be empty');

      expect(searchRepository.find.callCount).to.equal(
        0,
        'The repository should not have been called',
      );
    });
  });

  describe('#typeAhead', () => {
    it('returns search results', async () => {
      const searchRepository = {
        typeAhead: sinon.stub().resolves(['result_1', 'result_2', 'result_3']),
      };
      const getEstablishmentName = sinon.stub().returns('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const result = await service.typeAhead({
        query: 'Test Query',
        establishmentId: 123,
        limit: 3,
      });

      expect(searchRepository.typeAhead.callCount).to.equal(
        1,
        'The repository should have been called',
      );

      expect(searchRepository.typeAhead.lastCall.args[0]).to.eql(
        {
          query: 'Test Query',
          prison: 'HMP Development',
          limit: 3,
        },
        'The repository should have been called with the correct arguments',
      );

      expect(getEstablishmentName.callCount).to.equal(
        1,
        'The service should get the establishment name',
      );

      expect(getEstablishmentName.lastCall.args[0]).to.eql(123);

      expect(Array.isArray(result)).to.equal(
        true,
        'The service should return an array of results',
      );
    });

    it('returns empty when there is no query', async () => {
      const searchRepository = {
        typeAhead: sinon.spy(),
      };
      const getEstablishmentName = sinon.stub().returns('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const results = await service.typeAhead({
        query: '',
        establishmentId: 123,
        limit: 3,
      });

      expect(Array.isArray(results)).to.equal(
        true,
        'The method should return an array',
      );

      expect(results.length).to.equal(0, 'The array should be empty');

      expect(searchRepository.typeAhead.callCount).to.equal(
        0,
        'The repository should not have been called',
      );
    });
  });
});
