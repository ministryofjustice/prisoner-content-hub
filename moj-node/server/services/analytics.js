const createAnalyticsService = ({ analyticsRepository }) => {
  function sendEvent({
    category,
    action,
    label,
    value,
    sessionId,
    userAgent,
    screen,
    viewport,
  }) {
    return analyticsRepository.sendEvent({
      category,
      action,
      label,
      value,
      sessionId,
      userAgent,
      screen,
      viewport,
    });
  }

  function sendPageTrack({
    hostname,
    page,
    title,
    sessionId,
    userAgent,
    screen,
    viewport,
  }) {
    return analyticsRepository.sendPageTrack({
      hostname,
      page,
      title,
      sessionId,
      userAgent,
      screen,
      viewport,
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
