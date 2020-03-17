/* eslint-disable consistent-return */

const fs = require('fs');
const { dirname } = require('path');
const mkdirp = require('mkdirp');

const production = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'test';

const recordBuildInfoTo = (target, contents, callback) => {
  writeFile(target, JSON.stringify(contents, null, 2), callback);
};

function writeFile(path, contents, callback) {
  mkdirp(dirname(path), err => {
    if (err) return callback(err);

    fs.writeFile(path, contents, callback);
  });
}

const getEnv = (name, fallback, options = {}) => {
  if (process.env[name]) {
    return process.env[name];
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback;
  }
  throw new Error(`Missing env var ${name}`);
};

module.exports = {
  isProduction: production,
  isTest: test,
  recordBuildInfoTo,
  getEnv,
};
