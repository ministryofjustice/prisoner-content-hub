const createAnalyticsService = ({ analyticsRepository }) => {
  function sendEvent({ category, action, label, value, sessionId, userAgent }) {
    return analyticsRepository.sendEvent({
      category,
      action,
      label,
      value,
      sessionId,
      userAgent,
    });
  }

  function sendPageTrack({ hostname, page, title, sessionId, userAgent }) {
    return analyticsRepository.sendPageTrack({
      hostname,
      page,
      title,
      sessionId,
      userAgent,
    });
  }

  return {
    sendEvent,
    sendPageTrack,
  };
};

module.exports = {
  createAnalyticsService,
};
