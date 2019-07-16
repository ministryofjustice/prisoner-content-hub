const {
  getEstablishmentId,
  getEstablishmentName,
  capitalize,
} = require('../utils');

module.exports = function establishmentToggle(req, res, next) {
  if (!req.session.prison) {
    req.session.prison = req.app.locals.envVars.establishmentId;
  }

  if (req.query.prison) {
    req.session.prison = req.query.prison;
  }

  const establishmentId = getEstablishmentId(req.session.prison);
  const establishmentName = getEstablishmentName(establishmentId);

  req.app.locals.envVars.establishmentId = establishmentId;
  req.app.locals.envVars.APP_NAME = `HMP ${capitalize(establishmentName)}`;

  next();
};
