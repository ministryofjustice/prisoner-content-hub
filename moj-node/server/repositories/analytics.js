const config = require('../config');

function analyticsRepository(httpClient) {
  function sendEvent({ category, action, label, value, sessionId }) {
    const postData = {
      v: '1',
      tid: config.analytics.siteId,
      cid: sessionId,
      t: 'event',
      ec: category,
      ea: action,
      el: label,
    };

    if (value !== undefined) {
      postData.ev = value;
    }

    return httpClient.postFormData(config.analytics.endpoint, postData);
  }
  function sendPageTrack({ hostname, page, title, sessionId }) {
    const postData = {
      v: '1',
      tid: config.analytics.siteId,
      cid: sessionId,
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
