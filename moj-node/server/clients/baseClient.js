const client = require('axios');
const httpAdapter = require('axios/lib/adapters/http');
const ClientError = require('axios/lib/core/createError');

client.defaults.adapter = httpAdapter;

module.exports = { baseClient: client, ClientError };
