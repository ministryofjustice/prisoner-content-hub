const { getEstablishmentId } = require('../utils');

function capitalizeFirstLetter(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function establishmentToggle(req, res, next) {
  const { prison } = req.query;
  const establishmentId = getEstablishmentId(prison);

  res.locals.establishmentId = getEstablishmentId(prison);
  req.app.locals.envVars.APP_NAME = `HMP ${establishmentId !== 0 ? capitalizeFirstLetter(prison) : 'Berwyn'}`;

  next();
};
