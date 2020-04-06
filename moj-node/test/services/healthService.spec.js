const {
  createHealthService,
  statuses,
} = require('../../server/services/health');
const { logger, createClient } = require('../test-helpers');

const config = {
  api: {
    hubHealth: 'https://foo.bar/baz',
  },
  elasticsearch: {
    health: 'https://foo.bar/baz',
  },
};

const { UP, DOWN, PARTIALLY_DEGRADED } = statuses;

describe('HealthService', () => {
  const client = createClient();

  beforeEach(() => {
    client.get.reset();
  });
  context('When the all services are up', () => {
    it('returns status of the application', async () => {
      client.get
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
      `);
      const service = createHealthService({ client, logger, config });
      const status = await service.status();

      expect(client.get.callCount).to.equal(2);
      expect(status).to.eql({
        status: UP,
        dependencies: {
          drupal: UP,
          elasticsearch: UP,
        },
      });
    });
  });

  context('when the some services are down', () => {
    it('returns status of the application', async () => {
      client.get
        .returns(null)
        .onSecondCall()
        .returns(
          `
            <?xml version="1.0" encoding="utf-8" ?>
            <result>3.10.0</result>
          `,
        )
        .onThirdCall()
        .returns({ status: 'green' });
      const service = createHealthService({ client, logger, config });
      const status = await service.status();

      expect(client.get.callCount).to.equal(2);
      expect(status).to.eql({
        status: PARTIALLY_DEGRADED,
        dependencies: {
          drupal: DOWN,
          elasticsearch: UP,
        },
      });
    });
  });

  context('when the all services are down', () => {
    it('returns status of the application', async () => {
      client.get
        .returns(null)
        .onSecondCall()
        .returns({ status: 'red' });
      const service = createHealthService({ client, logger, config });
      const status = await service.status();

      expect(client.get.callCount).to.equal(2);
      expect(status).to.eql({
        status: DOWN,
        dependencies: {
          drupal: DOWN,
          elasticsearch: DOWN,
        },
      });
    });
  });
});
