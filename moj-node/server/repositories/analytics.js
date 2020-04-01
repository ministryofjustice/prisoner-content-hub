const config = require('../config');

function analyticsRepository(httpClient) {
  function sendEvent({ type, category, action, label, value }) {
    const postData = {
      v: '1',
      tid: config.analytics.siteId,
      cid: '555',
      t: type,
      ec: category,
      ea: action,
      el: label,
      ev: value,
    };

    return httpClient.postFormData(config.analytics.endpoint, postData);
  }

  return {
    sendEvent,
  };
}

module.exports = {
  analyticsRepository,
};
