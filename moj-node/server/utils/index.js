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

const capitalize = (str = '') => {
  return str
    .split('')
    .map((letter, index) => {
      if (index === 0) return letter.toUpperCase();
      return letter.toLowerCase();
    })
    .join('');
};

function relativeUrlFrom(url = '') {
  const urlSchemeAndAuthorityRegex = /^https?:\/\/[^/]+/;
  return url.replace(urlSchemeAndAuthorityRegex, '');
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
};
