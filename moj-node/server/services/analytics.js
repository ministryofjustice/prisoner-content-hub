const createAnalyticsService = ({ analyticsRepository }) => {
  function sendEvent({ event, category, action, label, value }) {
    return analyticsRepository.sendEvent({
      event,
      category,
      action,
      label,
      value,
    });
  }

  return {
    sendEvent,
  };
};

module.exports = {
  createAnalyticsService,
};
