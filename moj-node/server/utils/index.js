const R = require('ramda');
const config = require('../config');

const isEmpty = val => R.isEmpty(val) || R.isNil(val);

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
    792: 'berwyn',
    793: 'wayland',
  };
  return establishmentName[id];
}

function getGoogleAnalyticsId(id) {
  const googleAnalyticsId = {
    0: 'UA-152065860-3',
    792: 'UA-152065860-1',
    793: 'UA-152065860-2',
  };
  return googleAnalyticsId[id];
}

const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

function relativeUrlFrom(url = '', override) {
  const urlSchemeAndAuthorityRegex = /^https?:\/\/[^/]+/;
  const newUrlAuthority = override || '';
  return url.replace(urlSchemeAndAuthorityRegex, newUrlAuthority);
}

function fixUrlForProduction(url) {
  if (config.production) {
    return relativeUrlFrom(url);
  }
  return url;
}

module.exports = {
  relativeUrlFrom,
  fixUrlForProduction,
  getEstablishmentId,
  getEstablishmentName,
  isEmpty,
  capitalize,
  getGoogleAnalyticsId,
};
