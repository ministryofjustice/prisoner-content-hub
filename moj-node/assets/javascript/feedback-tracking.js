(function () {
  function sendFeedback(data) {
    $.ajax({
      type: 'POST',
      url: '/feedback/' + data.id,
      data: data
    });
  }

  var CHARACTER_LIMIT = 240;
  var typesDisplay = {
    video: 'video',
    radio: 'podcast',
    page: 'article',
    game: 'game',
    'landing-page': 'topic',
    series: 'series',
    tags: 'topic'
  };
  var types = {
    video: 'VIDEO',
    radio: 'AUDIO',
    page: 'ARTICLE',
    game: 'GAME',
    'landing-page': 'TOPIC',
    series: 'SERIES',
    tags: 'TAG'
  };

  window._feedback = {};

  function feedbackTracker(rootElementId) {
    var widget = $('#' + rootElementId);
    var contentType = widget.data('item-type');
    var secondaryTags = widget.data('item-tags');
    var categories = widget.data('item-categories');

    window._feedback.title = widget.data('item-title');
    window._feedback.url = window.location.pathname;
    window._feedback.contentType = types[contentType] || contentType;
    window._feedback.categories = categories ? ('' + categories).split(',') : [];
    window._feedback.secondaryTags = secondaryTags ? ('' + secondaryTags).split(',') : [];
    window._feedback.id = widget.data('item-feedback-id');

    var series = widget.data('item-series');
    if (series) {
      window._feedback.series = series;
    }

    function showFeedbackForm() {
      $('[data-feedback-form]').removeClass('govuk-u-hidden');
    }

    function hideFeedbackForm() {
      $('[data-feedback-form]').addClass('govuk-u-hidden');
    }

    function updateCharacterCount(characterCount) {
      var characterCount = characterCount || 0;
      $('[data-feedback-comment-counter]').text(CHARACTER_LIMIT - characterCount);
    }

    function enableFormSubmit() {
      $('[data-feedback-form]')
        .find('button')
        .attr('disabled', false);
    }

    function disableFormSubmit() {
      $('[data-feedback-form]')
        .find('button')
        .attr('disabled', true);
    }

    function updateFeedbackSentimentText(feedback) {
      var type = widget.data('item-type');
      var typeText = typesDisplay[type] ? typesDisplay[type] : '';

      if (feedback === 'LIKE') {
        $('[data-item-feedback-text]').text('I like this ' + typeText);
      } else {
        $('[data-item-feedback-text]').text('I do not like this ' + typeText);
      }
    }

    function updateSentimentIcons(sentiment) {
      $('[data-feedback-sentiment]').removeClass('is-selected');
      $('[data-feedback-sentiment][value="' + sentiment + '"]').addClass('is-selected');
    }

    widget.find('[data-feedback-sentiment]').on('click', function (e) {
      e.preventDefault();
      var sentiment = $(this).val();
      window._feedback.sentiment = sentiment;
      updateFeedbackSentimentText(sentiment);
      updateSentimentIcons(sentiment);
      showFeedbackForm();
      sendFeedback(window._feedback);
    });

    widget.find('[data-feedback-comment]').on('keyup', function (e) {
      e.preventDefault();
      var value = $(this)
        .val()
        .slice(0, CHARACTER_LIMIT);
      var characterCount = value.length;
      $('[data-feedback-comment]').val(value);
      updateCharacterCount(characterCount);
      enableFormSubmit();
    });

    widget.find('[data-feedback-form]').on('submit', function (e) {
      e.preventDefault();
      window._feedback.comment = $(this)
        .find('[data-feedback-comment]')
        .val();
      sendFeedback(window._feedback);
      disableFormSubmit();

      setTimeout(function () {
        hideFeedbackForm();
        enableFormSubmit();
        $('[data-feedback-comment]').val('');
      }, 1500);
    });
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = feedbackTracker;
  } else {
    window.feedbackTracker = feedbackTracker;
  }
})();
