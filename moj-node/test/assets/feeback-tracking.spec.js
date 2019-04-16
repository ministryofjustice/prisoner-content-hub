const fromHTML = require('from-html/lib/from-html.js');
const feedbackWidgetTemplate = require('./templates/feedbackWidget');

const feedbackTracker = require('../../assets/javascript/feedback-tracking');

describe('Feedback tracker', () => {
  beforeEach(() => {
    global._paq = [];
  });

  afterEach(() => {
    delete global._paq;
  });

  describe('when the thumbs up is clicked (LIKE)', () => {
    it("enqueues an event to piwik's _paq", () => {
      expect(_paq.length).to.equal(0);

      const { thumbsUp } = render();

      thumbsUp.click();

      expect(_paq.length).to.equal(2);
    });

    it('correctly formats data to be sent to Piwik', () => {
      expect(_paq.length).to.equal(0);

      const { thumbsUp } = render({ category: 'radio' });

      thumbsUp.click();

      const event = _paq[1];

      testEventContents(event, {
        eventAction: 'LIKE',
        eventValue: '1',
        action: 'LIKE',
        eventCategory: 'podcast',
        category: 'podcast',
      });
    });

    it('updates the user with information about the action', () => {
      const { thumbsUp, feedbackActionText } = render();

      expect(feedbackActionText.textContent).to.equal('');

      thumbsUp.click();

      expect(feedbackActionText.textContent).to.include('I like this');
    });
  });

  describe('when the thumbs up is clicked (UNLIKE)', () => {
    it('correctly formats data to be sent to Piwik', () => {
      expect(_paq.length).to.equal(0);

      const { thumbsUp } = render();

      thumbsUp.click();
      thumbsUp.click();

      const event = _paq[3];

      testEventContents(event, {
        eventAction: 'UNLIKE',
        eventValue: '0',
        action: 'UNLIKE',
      });
    });
  });

  describe('when you send feedback after liking content', () => {
    it('correctly formats data to be sent to Piwik', () => {
      expect(_paq.length).to.equal(0);

      const { thumbsUp, feedbackForm } = render({ category: 'page' });

      thumbsUp.click();

      feedbackForm.querySelector('textarea').value = 'foo content';

      feedbackForm.submit();

      const event = _paq[2];

      testEventContents(event, {
        eventAction: 'LIKE - foo content',
        eventValue: '1',
        action: 'LIKE',
        eventCategory: 'article',
        category: 'article',
      });
    });
  });

  describe('when the thumbs down is clicked (DISLIKE)', () => {
    it('correctly formats data to be sent to Piwik', () => {
      expect(_paq.length).to.equal(0);

      const { thumbsDown } = render({ category: 'game' });

      thumbsDown.click();

      const event = _paq[1];

      testEventContents(event, {
        eventAction: 'DISLIKE',
        eventValue: '-1',
        action: 'DISLIKE',
        eventCategory: 'game',
        category: 'game',
      });
    });

    it('updates the user with information about the action', () => {
      const { thumbsDown, feedbackActionText } = render();

      expect(feedbackActionText.textContent).to.equal('');

      thumbsDown.click();

      expect(feedbackActionText.textContent).to.include('I do not like this');
    });
  });

  describe('when the thumbs down is clicked (UNDISLIKE)', () => {
    it('correctly formats data to be sent to Piwik', () => {
      expect(_paq.length).to.equal(0);

      const { thumbsDown } = render();

      thumbsDown.click();
      thumbsDown.click();

      const event = _paq[3];

      testEventContents(event, {
        eventAction: 'UNDISLIKE',
        eventValue: '0',
        action: 'UNDISLIKE',
      });
    });
  });

  describe('when you send feedback after disliking content', () => {
    it('correctly formats data to be sent to Piwik', () => {
      expect(_paq.length).to.equal(0);

      const { thumbsDown, feedbackForm } = render();

      thumbsDown.click();

      feedbackForm.querySelector('textarea').value = 'foo content';

      feedbackForm.submit();

      const event = _paq[2];

      testEventContents(event, {
        eventAction: 'DISLIKE - foo content',
        eventValue: '-1',
        action: 'DISLIKE',
      });
    });
  });
});

function testEventContents(event, expectedConfig) {
  const expected = {
    trackEvent: 'trackEvent',
    eventCategory: 'video',
    eventAction: 'LIKE',
    eventValue: '0',
    title: 'foo-name',
    pageUrl: '/',
    action: 'LIKE',
    category: 'video',
    series: 'foo-series',
    timeSpentOfPage: '0',
    visitorId: 'ID_NOT_FOUND',
    establishment: 'foo-establishment',
    ...expectedConfig,
  };

  const [trackEvent, eventCategory, eventAction, eventName, eventValue] = event;

  expect(trackEvent).to.equal(expected.trackEvent, 'trackEvent did not match');
  expect(eventCategory).to.equal(
    expected.eventCategory,
    'eventCategory did not match',
  );
  expect(eventAction).to.equal(
    expected.eventAction,
    'eventAction did not match',
  );
  expect(eventName.length).to.be.greaterThan(3, 'eventName was empty');
  expect(eventValue).to.equal(expected.eventValue, 'eventValue did not match');

  const [
    title,
    pageUrl,
    action,
    timestamp,
    category,
    series,
    timeSpentOfPage,
    visitorId,
    establishment,
  ] = eventName.split('|');

  expect(title).to.equal(
    expected.title,
    'the title in eventName did not match',
  );
  expect(pageUrl).to.equal(
    expected.pageUrl,
    'the url in eventName did not match',
  );
  expect(action).to.equal(
    expected.action,
    'the action in eventName did not match',
  );
  expect(timestamp).to.match(
    /\w{13,}/,
    'the timestamp in eventName was invalid',
  );
  expect(category).to.equal(
    expected.category,
    'the category in eventName did not match',
  );
  expect(series).to.equal(
    expected.series,
    'the series in eventName did not match',
  );
  expect(timeSpentOfPage).to.equal(
    expected.timeSpentOfPage,
    'the timeSpentOnPage in eventName did not match',
  );
  expect(visitorId).to.equal(
    expected.visitorId,
    'the visitorId in eventName did not match',
  );
  expect(establishment).to.equal(
    expected.establishment,
    'the establishment in eventName did not match',
  );
}

function render({ category = 'video' } = {}) {
  const {
    container: frag,
    thumbsUp,
    thumbsDown,
    feedbackForm,
    feedbackActionText,
  } = fromHTML(feedbackWidgetTemplate({ category }));
  const container = document.createElement('DIV');

  container.appendChild(frag);

  feedbackTracker(container);

  return {
    container,
    thumbsUp,
    thumbsDown,
    feedbackForm,
    feedbackActionText,
  };
}
