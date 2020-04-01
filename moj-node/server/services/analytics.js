const createAnalyticsService = ({ analyticsRepository }) => {
  function sendEvent({ category, action, label, value }) {
    return analyticsRepository.sendEvent({
      category,
      action,
      label,
      value,
    });
  }

  function sendPageTrack({ hostname, page, title }) {
    return analyticsRepository.sendPageTrack({
      hostname,
      page,
      title,
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
