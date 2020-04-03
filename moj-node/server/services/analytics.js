const createAnalyticsService = ({ analyticsRepository }) => {
  function sendEvent({ category, action, label, value, sessionId }) {
    return analyticsRepository.sendEvent({
      category,
      action,
      label,
      value,
      sessionId,
    });
  }

  function sendPageTrack({ hostname, page, title, sessionId }) {
    return analyticsRepository.sendPageTrack({
      hostname,
      page,
      title,
      sessionId,
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
