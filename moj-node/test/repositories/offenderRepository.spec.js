const { offenderRepository } = require('../../server/repositories/offender');

describe('offenderRepository', () => {
  describe('getOffenderDetailsFor', () => {
    it('validates the offender number before making a call to the API', async () => {
      const offenderNumber = '1234567';
      const client = {
        get: sinon.stub(),
      };
      const repository = offenderRepository(client);

      let exception = null;

      try {
        await repository.getOffenderDetailsFor(offenderNumber);
      } catch (e) {
        exception = e;
      }

      expect(exception.message).to.equal('Invalid offender number');
      expect(client.get.called).to.equal(false);
    });
    it('should make the offender number uppercase before making a call to the API', async () => {
      const offenderNumber = 'a1234bc';
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getOffenderDetailsFor(offenderNumber);

      expect(client.get.lastCall.args[0]).to.include(
        `/offenderNo/${offenderNumber.toUpperCase()}`,
      );
      expect(result).to.equal('SOME_RESULT');
    });
    it('calls the offender endpoint for a given ID', async () => {
      const offenderNumber = 'A1234BC';
      const client = {
        get: sinon.stub().resolves('SOME_RESULT'),
      };
      const repository = offenderRepository(client);
      const result = await repository.getOffenderDetailsFor(offenderNumber);

      expect(client.get.lastCall.args[0]).to.include(
        `/offenderNo/${offenderNumber}`,
      );
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

  describe('getEventsFor', () => {
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
