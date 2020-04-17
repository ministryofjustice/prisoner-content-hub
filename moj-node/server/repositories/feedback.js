const config = require('../config');

function feedbackRepository(httpClient) {
  function sendFeedback({
    title,
    url,
    contentType,
    series,
    categories,
    secondaryTags,
    sentiment,
    comment,
    date,
    establishment,
    sessionId,
    feedbackId,
  }) {
    const postData = {
      title,
      url,
      contentType,
      sentiment,
      date,
      establishment,
      sessionId,
      categories,
      secondaryTags,
    };

    if (series) {
      postData.series = series;
    }

    if (comment) {
      postData.comment = comment;
    }

    if (feedbackId) {
      const endpoint = `${config.feedback.endpoint}/${feedbackId}`;
      return httpClient.post(endpoint, postData);
    }

    return Promise.resolve();
  }
  return {
    sendFeedback,
  };
}

module.exports = {
  feedbackRepository,
};
