const createHealthService = require('../../server/services/health');

describe('HealthService', () => {
  context('when the all services are up', () => {
    it('returns status of the application', async () => {
      const client = {
        get: sinon
          .stub()
          .returns({
            backend: {
              timestamp: 1564392127,
              'Drupal Version': '8.7.3',
            },
            db: {
              database: 'mysql',
              status: 'up',
            },
          })
          .onSecondCall().returns(`
            <?xml version="1.0" encoding="utf-8" ?>
            <result>3.10.0</result>
          `),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(3);
      expect(status).to.eql({
        status: 'UP',
        dependencies: {
          drupal: 'UP',
          matomo: 'UP',
          elasticsearch: 'UP',
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
          .returns(
            `
            <?xml version="1.0" encoding="utf-8" ?>
            <result>3.10.0</result>
          `,
          )
          .onThirdCall()
          .returns({ status: 'green' }),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(3);
      expect(status).to.eql({
        status: 'PARTIALLY_DEGRADED',
        dependencies: {
          drupal: 'DOWN',
          matomo: 'UP',
          elasticsearch: 'UP',
        },
      });
    });
  });

  context('when the all services are down', () => {
    it('returns status of the application', async () => {
      const client = {
        get: sinon
          .stub()
          .returns(null)
          .onSecondCall()
          .returns(null)
          .onThirdCall()
          .returns({ status: 'red' }),
      };
      const service = createHealthService(client);
      const status = await service.status();

      expect(client.get.callCount).to.equal(3);
      expect(status).to.eql({
        status: 'DOWN',
        dependencies: {
          drupal: 'DOWN',
          matomo: 'DOWN',
          elasticsearch: 'DOWN',
        },
      });
    });
  });
});
