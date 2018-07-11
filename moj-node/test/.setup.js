require('dotenv').config();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const chaiString = require('chai-string');
const expect = require('chai').expect;

// Test Assertion libraries
chai.use(chaiAsPromised);
chai.use(chaiString);

global.expect = chai.expect;
global.sinon = sinon;
global.expect = expect;
