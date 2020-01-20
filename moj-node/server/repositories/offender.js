const crypto = require('crypto');
const config = require('../config');

function offenderRepository(httpClient) {
  function getOffenderDetailsFor(offenderNo) {
    return httpClient.get(
      `${config.nomis.api.bookings}/offenderNo/${offenderNo}`,
    );
  }

  function getIEPSummaryFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/iepSummary`,
    );
  }

  function getBalancesFor(bookingId) {
    return httpClient.get(`${config.nomis.api.bookings}/${bookingId}/balances`);
  }

  function getPhoneCreditFor(offenderNo) {
    function getBytesFromHexString(hexString) {
      const bytesAsStrings = hexString.trim().split(' ');
      const bytes = new Uint8Array(bytesAsStrings.length);

      bytesAsStrings.foreach((byteString, index) => {
        bytes[index] = parseInt(byteString, 16);
      });

      return bytes;
    }

    const key = crypto.pbkdf2Sync(
      config.phone.passPhrase,
      getBytesFromHexString(config.phone.salt),
      config.phone.iterations,
      32,
      'aes-256-cbc',
    );

    const iv = config.phone.initialisationVector;

    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };

    // function decrypt(algorithm, text) {
    //   let iv = Buffer.from(text.iv, 'hex');
    //   let encryptedText = Buffer.from(text.encryptedData, 'hex');
    //   let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    //   let decrypted = decipher.update(encryptedText);
    //   decrypted = Buffer.concat([decrypted, decipher.final()]);
    //   return decrypted.toString();
    // }
    /*
    <?xml version="1.0" encoding="utf-16"?> <SSTIRequest>
<balanceEnquiry> <request>BalanceEnquiry</request> <reference>A1XXXXX14590687</reference> <prisonerId>A1XXXXX</prisonerId>
</balanceEnquiry> </SSTIRequest>
<?xml version="1.0" encoding="utf-8"?> <SSTIResponse>
  <balanceEnquiry>
<response>BalanceEnquiry</response> <resultCode>0</resultCode> <reference>A1XXXXX14590687</reference> <prisonerId>A1XXXXX</prisonerId> <balance>0.81</balance>
</balanceEnquiry> </SSTIResponse>
    */
    return httpClient.get(`${config.phone.api.credit}/${offenderNo}`);
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

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getPhoneCreditFor,
    getKeyWorkerFor,
    getNextVisitFor,
    getLastVisitFor,
    getVisitsFor,
    sentenceDetailsFor,
    getEventsForToday,
    getEventsFor,
  };
}

module.exports = offenderRepository;
