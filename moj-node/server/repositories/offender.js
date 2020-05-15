const net = require('net');
const xmlParser = require('fast-xml-parser');
const { path } = require('ramda');
const {
  phoneBalanceEnquiry,
  phoneEncrypt,
  phoneDecrypt,
  generateKey,
} = require('../utils/index');
const config = require('../config');

function validateOffenderNumberFor(offenderNo) {
  const pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);
  return pattern.test(offenderNo);
}

function offenderRepository(httpClient) {
  function getOffenderDetailsFor(offenderNo) {
    if (validateOffenderNumberFor(offenderNo)) {
      return httpClient.get(
        `${config.nomis.api.bookings}/offenderNo/${offenderNo.toUpperCase()}`,
      );
    }
    throw new Error('Invalid offender number');
  }

  function getIEPSummaryFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/iepSummary`,
    );
  }

  function getBalancesFor(bookingId) {
    return httpClient.get(`${config.nomis.api.bookings}/${bookingId}/balances`);
  }

  function getKeyWorkerFor(offenderNo) {
    return httpClient.get(
      `${config.nomis.api.bookings}/offenderNo/${offenderNo}/key-worker`,
    );
  }

  function getNextVisitFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/visits/next`,
    );
  }

  function getLastVisitFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/visits/last`,
    );
  }

  function getVisitsFor(bookingId, startDate) {
    const endpoint = `${config.nomis.api.bookings}/${bookingId}/visits`;
    const query = [`fromDate=${startDate}`, `toDate=${startDate}`];

    return httpClient.get(`${endpoint}?${query.join('&')}`);
  }

  function sentenceDetailsFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/sentenceDetail`,
    );
  }

  function getEventsForToday(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/events/today`,
    );
  }

  function getEventsFor(bookingId, startDate, endDate) {
    const endpoint = `${config.nomis.api.bookings}/${bookingId}/events`;
    const query = [`fromDate=${startDate}`, `toDate=${endDate}`];

    return httpClient.get(`${endpoint}?${query.join('&')}`);
  }

  function getPhoneBalance(xmlString) {
    const parsedData = xmlParser.parse(xmlString);
    const resultCode = path(
      ['SSTIResponse', 'balanceEnquiry', 'resultCode'],
      parsedData,
    );

    return resultCode !== 0
      ? 0
      : path(['SSTIResponse', 'balanceEnquiry', 'balance'], parsedData);
  }

  function getPhoneCreditFor(offenderNo) {
    return new Promise(resolve => {
      const xmlData = phoneBalanceEnquiry(offenderNo);
      const key = generateKey(config.phone);
      const iv = config.phone.initialisationVector;
      const encryptedString = phoneEncrypt(key, xmlData, iv);
      const dataLength = Buffer.alloc(4);
      dataLength.writeUInt32BE(encryptedString.length, 0);

      const connectionConfig = {
        port: config.phone.port,
        host: config.phone.server,
      };
      const client = new net.Socket();

      client.setTimeout(10000, () => {});
      client.connect(connectionConfig, () => {
        client.write(dataLength);
        client.write(encryptedString);
      });
      client.on('data', data => {
        if (data.length === 4) {
          const dataBuffer = Buffer.from(data);
          dataBuffer.readUInt32BE(0);
        }
        if (data.length > 4) {
          const decryptedString = phoneDecrypt(key, Buffer.from(data), iv);
          const balance = getPhoneBalance(decryptedString);
          resolve(balance);
        }
      });
      client.on('error', () => {
        resolve(0);
      });
    });
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getNextVisitFor,
    getLastVisitFor,
    getVisitsFor,
    sentenceDetailsFor,
    getEventsForToday,
    getEventsFor,
    getPhoneCreditFor,
  };
}

module.exports = {
  offenderRepository,
};
