const config = require('../config');

function analyticsRepository(httpClient) {
  function sendEvent({ category, action, label, value }) {
    const postData = {
      v: '1',
      tid: config.analytics.siteId,
      cid: '555',
      t: 'event',
      ec: category,
      ea: action,
      el: label,
    };

    if (value !== undefined) {
      postData.value = value;
    }

    return httpClient.postFormData(config.analytics.endpoint, postData);
  }
  function sendPageTrack({ hostname, page, title }) {
    const postData = {
      v: '1',
      tid: config.analytics.siteId,
      cid: '555',
      t: 'pageview',
      dh: hostname,
      dp: page,
      dt: title,
    };

    return httpClient.postFormData(config.analytics.endpoint, postData);
  }

  return {
    sendEvent,
    sendPageTrack,
  };
}

module.exports = {
  analyticsRepository,
};
