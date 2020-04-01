const createAnalyticsService = ({ analyticsRepository }) => {
  function sendEvent({ type, category, action, label, value }) {
    return analyticsRepository.sendEvent({
      type,
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
