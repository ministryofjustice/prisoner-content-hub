// const config = require('../config');

function analyticsRepository(httpClient) {
  function sendEvent({ event, category, action, label, value }) {
    const postData = {
      v: 1,
      tid: 'UA-152065860-1',
      cid: 555,
      t: event,
      ec: category,
      ea: action,
      el: label,
      ev: value,
    };

    return httpClient.post(
      'https://www.google-analytics.com/collect',
      postData,
    );
  }

  return {
    sendEvent,
  };
}

module.exports = {
  analyticsRepository,
};
