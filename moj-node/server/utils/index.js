const config = require('../config');

function getEstablishmentId(name) {
  if (typeof name === 'number') return name;

  const prisons = {
    berwyn: 792,
    wayland: 793,
  };

  return prisons[name] || 0;
}

function getEstablishmentName(id) {
  const establishmentName = {
    792: 'HMP Berwyn',
    793: 'HMP Wayland',
  };
  return establishmentName[id];
}

function replaceURLWithDefinedEndpoint(
  url = '',
  alternateUrl = config.hubEndpoint,
) {
  const urlSchemeAndAuthorityRegex = /^https?:\/\/[^/]+/;
  const updatedUrl = url.replace(urlSchemeAndAuthorityRegex, alternateUrl);

  return updatedUrl;
}

function fixUrlForProduction(url, alternateUrl = config.hubEndpoint) {
  if (config.production) {
    return replaceURLWithDefinedEndpoint(url, alternateUrl);
  }
  return url;
}

module.exports = {
  replaceURLWithDefinedEndpoint,
  fixUrlForProduction,
  getEstablishmentId,
  getEstablishmentName,
};
