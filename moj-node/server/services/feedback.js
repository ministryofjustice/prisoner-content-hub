const createFeedbackService = ({ feedbackRepository }) => {
  function sendFeedback(feedback) {
    return feedbackRepository.sendFeedback(feedback);
  }

  return {
    sendFeedback,
  };
};

module.exports = {
  createFeedbackService,
};
