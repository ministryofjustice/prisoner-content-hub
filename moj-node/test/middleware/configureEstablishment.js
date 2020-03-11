const createEstablishmentMiddleware = require('../../server/middleware/configureEstablishment');

describe('configureEstablishment', () => {
  const defaultPrison = 'wayland';
  const overridePrison = 'berwyn';

  const defaultRequest = {
    app: {
      locals: {
        config: {
          establishmentName: defaultPrison,
        },
      },
    },
  };

  const next = sinon.spy();

  beforeEach(() => {
    next.resetHistory();
  });

  describe('When configured to allow prison switching', () => {
    it('should default when no alternative in query param or in the session', () => {
      const configureEstablishment = createEstablishmentMiddleware({
        shouldAllowSwitch: true,
      });

      const req = {
        ...defaultRequest,
        session: {},
        query: {},
      };

      const res = { locals: {} };

      configureEstablishment(req, res, next);

      expect(req.session).to.have.property(
        'prison',
        defaultPrison,
        'establishment should be persisted in the session',
      );
      expect(res.locals).to.have.property(
        'establishmentName',
        `HMP ${defaultPrison.slice(0, 1).toUpperCase() +
          defaultPrison.slice(1)}`,
      );
      expect(res.locals).to.have.property('establishmentId');
      expect(next.called).to.equal(true, 'next should have been called');
    });

    it('should override when the prison provided in the session', () => {
      const configureEstablishment = createEstablishmentMiddleware({
        shouldAllowSwitch: true,
      });

      const req = {
        ...defaultRequest,
        session: { prison: overridePrison },
        query: {},
      };

      const res = { locals: {} };

      configureEstablishment(req, res, next);

      expect(req.session).to.have.property(
        'prison',
        overridePrison,
        'establishment should be persisted in the session',
      );
      expect(res.locals).to.have.property(
        'establishmentName',
        `HMP ${overridePrison.slice(0, 1).toUpperCase() +
          overridePrison.slice(1)}`,
      );
      expect(res.locals).to.have.property('establishmentId');
      expect(next.called).to.equal(true, 'next should have been called');
    });

    it('should override when the prison provided as a query param', () => {
      const configureEstablishment = createEstablishmentMiddleware({
        shouldAllowSwitch: true,
      });

      const req = {
        ...defaultRequest,
        session: { prison: defaultPrison },
        query: { prison: overridePrison },
      };

      const res = { locals: {} };

      configureEstablishment(req, res, next);

      expect(req.session).to.have.property(
        'prison',
        overridePrison,
        'establishment should be persisted in the session',
      );
      expect(res.locals).to.have.property(
        'establishmentName',
        `HMP ${overridePrison.slice(0, 1).toUpperCase() +
          overridePrison.slice(1)}`,
      );
      expect(res.locals).to.have.property('establishmentId');
      expect(next.called).to.equal(true, 'next should have been called');
    });
  });

  describe('When configured to NOT allow for prison switching', () => {
    it('should use the default configuration', () => {
      const configureEstablishment = createEstablishmentMiddleware({
        shouldAllowSwitch: false,
      });

      const req = {
        ...defaultRequest,
        session: { prison: overridePrison },
        query: { prison: overridePrison },
      };

      const res = { locals: {} };

      configureEstablishment(req, res, next);

      expect(req.session).to.have.property(
        'prison',
        defaultPrison,
        'establishment should be persisted in the session',
      );
      expect(res.locals).to.have.property(
        'establishmentName',
        `HMP ${defaultPrison.slice(0, 1).toUpperCase() +
          defaultPrison.slice(1)}`,
      );
      expect(res.locals).to.have.property('establishmentId');
      expect(next.called).to.equal(true, 'next should have been called');
    });
  });
});
