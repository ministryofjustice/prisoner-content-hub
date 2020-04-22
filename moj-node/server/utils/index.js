const R = require('ramda');
const crypto = require('crypto');
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
  if (str === '') return '';
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

function capitalizeAll(input, separator = ' ') {
  if (input === '') return '';

  const names = input.split(separator);

  return names.map(name => capitalize(name.trim())).join(separator);
}

function capitalizePersonName(input, separator = ' ') {
  if (input === '') return '';

  const names = input.split(separator);

  return names
    .map(name => capitalizeAll(capitalize(name.trim()), '-'))
    .join(separator);
}

function fillContentItems(contentItems = [], number = 4) {
  const numberItems = contentItems.length;

  if (numberItems % number === 0) {
    return contentItems;
  }

  const remainingItems =
    contentItems.length < number
      ? number - contentItems.length
      : number - (contentItems.length % number);
  let newItems = [];

  if (remainingItems > 0) {
    newItems = new Array(remainingItems);
  }

  return contentItems.concat(newItems);
}

function getBytesFromHexString(hexString) {
  const bytesAsStrings = hexString.trim().split(' ');
  const bytes = new Uint8Array(bytesAsStrings.length);

  bytesAsStrings.forEach((byteString, index) => {
    bytes[index] = parseInt(byteString.slice(-2), 16);
  });

  return bytes;
}

function phoneBalanceEnquiry(offenderNo, date = Date.now()) {
  const uuid = `${offenderNo}${date}`.slice(-20);

  return `<?xml version="1.0" encoding="utf-8"?>\r\n<SSTIRequest>\r\n  <balanceEnquiry>\r\n    <request>BalanceEnquiry</request>\r\n    <reference>${uuid}</reference>\r\n    <prisonerId>${offenderNo}</prisonerId>\r\n  </balanceEnquiry>\r\n</SSTIRequest>\r\n`;
}

function generateKey(options) {
  return crypto.pbkdf2Sync(
    options.passPhrase,
    getBytesFromHexString(options.salt),
    options.iterations,
    32,
    'sha1',
  );
}

function phoneEncrypt(key, xmlBuffer, iv) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    getBytesFromHexString(iv),
  );
  const encrypted = cipher.update(xmlBuffer, 'utf8');

  return Buffer.concat([encrypted, cipher.final()]);
}

function phoneDecrypt(key, encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    getBytesFromHexString(iv),
  );
  const decrypted = decipher.update(encryptedData);

  return Buffer.concat([decrypted, decipher.final()]).toString();
}

module.exports = {
  relativeUrlFrom,
  fixUrlForProduction,
  getEstablishmentId,
  getEstablishmentName,
  isEmpty,
  capitalize,
  capitalizeAll,
  getGoogleAnalyticsId,
  capitalizePersonName,
  fillContentItems,
  getBytesFromHexString,
  phoneBalanceEnquiry,
  generateKey,
  phoneEncrypt,
  phoneDecrypt,
};
