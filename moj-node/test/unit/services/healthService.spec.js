const createHealthService = require('../../../server/services/health');

describe('HealthService', () => {
  context('when the all services are up', () => {
    it('returns status of the application', async () => {
      const client = {
        get: sinon.stub().returns({ ok: true }),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(1);
      expect(status).to.eql({
        status: 'OK',
        dependencies: {
          hub: 'OK',
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

      expect(client.get.callCount).to.equal(1);
      expect(status).to.eql({
        status: 'DOWN',
        dependencies: {
          hub: 'DOWN',
        },
      });
    });

    it('returns status of the application when the health service is down', async () => {
      const client = {
        get: sinon.stub().throws({ ok: false }),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(1);
      expect(status).to.eql({
        status: 'DOWN',
        dependencies: {
          hub: 'DOWN',
        },
      });
    });
  });
});
