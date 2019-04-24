const createHealthService = require('../../server/services/health');

describe('HealthService', () => {
  context('when the all services are up', () => {
    it('returns status of the application', async () => {
      const client = {
        get: sinon.stub().returns({ ok: true }),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(2);
      expect(status).to.eql({
        status: 'UP',
        dependencies: {
          drupal: 'UP',
          matomo: 'UP',
        },
      });
    });
  });

  context('when the some services are down', () => {
    it('returns status of the application', async () => {
      const client = {
        get: sinon
          .stub()
          .returns(null)
          .onSecondCall()
          .returns({ ok: true }),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(2);
      expect(status).to.eql({
        status: 'PARTIALLY_DEGRADED',
        dependencies: {
          drupal: 'DOWN',
          matomo: 'UP',
        },
      });
    });
  });

  context('when the all services are down', () => {
    it('returns status of the application', async () => {
      const client = {
        get: sinon.stub().returns({ ok: false }),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(2);
      expect(status).to.eql({
        status: 'DOWN',
        dependencies: {
          drupal: 'DOWN',
          matomo: 'DOWN',
        },
      });
    });
  });
});
