const offenderRepository = require('../../server/repositories/offender');

describe('offenderRepository', () => {
  describe('getOffenderDetailsFor', () => {
    it('calls the offender endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getOffenderDetailsFor('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/offenderNo/FOO_ID');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe('getIEPSummaryFor', () => {
    it('calls the IEP summary endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getIEPSummaryFor('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/iepSummary');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe('getBalancesFor', () => {
    it('calls the balances endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getBalancesFor('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/balances');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe('getKeyWorkerFor', () => {
    it('calls the keyWorker endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getKeyWorkerFor('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/key-worker');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe('getNextVisitFor', () => {
    it('calls the nextVisit endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getNextVisitFor('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/visits/next');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe('getLastVisitFor', () => {
    it('calls the lastVisits endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getLastVisitFor('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/visits/last');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe('sentenceDetailsFor', () => {
    it('calls the sentenceDetails endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.sentenceDetailsFor('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/sentenceDetail');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe('getEventsForToday', () => {
    it('calls the getEventsForToday endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getEventsForToday('FOO_ID');

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/events/today');
      expect(result).to.equal('SOME_RESULT');
    });
  });

  describe.skip('getEventsFor', () => {
    it('calls the getEventsFor endpoint for a given ID', async () => {
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getEventsFor(
        'FOO_ID',
        '2019-04-07',
        '2019-04-07',
      );

      expect(client.get.lastCall.args[0]).to.include('/FOO_ID/events');
      expect(result).to.equal('SOME_RESULT');
    });
  });
});
