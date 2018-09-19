const request = require('supertest');

const createHealthRouter = require('../../server/routes/health');
const { setupBasicApp } = require('../test-helpers');

describe('/health', () => {
  it('returns the health status of the application', () => {
    const appInfo = {
      getBuildInfo: sinon.stub().returns({
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      }),
    };

    const healthService = {
      status: sinon.stub().returns({
        status: 'OK',
        dependencies: {
          foo: 'OK',
        },
      }),
    };
    const router = createHealthRouter({ appInfo, healthService });
    const app = setupBasicApp();

    app.use('/health', router);

    return request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).eql({
          buildNumber: 'foo-number',
          gitRef: 'foo-ref',
          gitDate: 'foo-date',
          status: 'OK',
          dependencies: {
            foo: 'OK',
          },
        });
      });
  });
});
