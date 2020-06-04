const { path, pathOr } = require('ramda');

const {
  getEstablishmentId: establishmentIdFor,
  getEstablishmentFormattedName,
  getEstablishmentPrefix,
} = require('../utils');

const defaults = { shouldAllowSwitch: false };

const configureEstablishment = ({ shouldAllowSwitch } = defaults) => (
  req,
  res,
  next,
) => {
  const defaultPrisonFrom = request =>
    path(['app', 'locals', 'config', 'establishmentName'], request);
  const existingPrisonFrom = request =>
    pathOr(defaultPrisonFrom(request), ['session', 'prison'], request);
  const selectedPrisonFrom = request =>
    pathOr(existingPrisonFrom(request), ['query', 'prison'], request);

  req.session.prison = shouldAllowSwitch
    ? selectedPrisonFrom(req)
    : defaultPrisonFrom(req);

  const establishmentId = establishmentIdFor(req.session.prison);

  res.locals.establishmentId = establishmentId;
  res.locals.establishmentName = `${getEstablishmentPrefix(
    establishmentId,
  )} ${getEstablishmentFormattedName(establishmentId)}`;

  next();
};

module.exports = {
  configureEstablishment,
};
