const { getEstablishmentId } = require('../utils');

function capitalizeFirstLetter(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function establishmentToggle(req, res, next) {
  if (!req.session.prison && req.query.prison) {
    req.session.prison = req.query.prison;
  }

  if (req.query.prison) {
    req.session.prison = req.query.prison;
  }

  const establishmentId = getEstablishmentId(req.session.prison);

  res.locals.establishmentId = establishmentId;
  req.app.locals.envVars.APP_NAME = `HMP ${establishmentId !== 0 ? capitalizeFirstLetter(req.session.prison) : 'Berwyn'}`;

  next();
};
