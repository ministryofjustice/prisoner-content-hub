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

  res.locals.establishmentId = establishmentId;
  res.locals.establishmentName = `HMP ${capitalize(establishmentName)}`;

  next();
};
