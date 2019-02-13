const puppeteer = require('puppeteer');

const config = require('../config');

describe('Home page', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  describe('promoted content', () => {
    let promotedContent;
    before(async () => {
      await page.goto(config.appURL);
      promotedContent = await page.$('[data-promoted-item-text]');
    });
    it('contains promoted content text', async () => {
      const promotedContentJshandle = await promotedContent.getProperty(
        'textContent',
      );
      const text = await promotedContentJshandle.jsonValue();

      expect(text).to.match(
        /\w{10,}/,
        'expected promoted content to include text',
      );
    });

    it('contains a call to action for more content', async () => {
      const callToAction = await promotedContent.$eval(
        '[data-call-to-action]',
        el => el.href,
      );

      expect(callToAction).to.match(
        /\/content\//,
        'expected to have a link to promoted content',
      );
    });
  });

  describe('Featured content', () => {
    before(async () => {
      await page.goto(config.appURL);
    });

    it('renders featured content sections titles', () => {
      const expectedSectionTitles = [
        'News and events',
        'Day-to-day',
        'Healthy mind and body',
        'Legal advice and your rights',
        'Inspiration',
        'Science and nature',
        'Art and culture',
        'History',
        'Music',
        'Games',
      ];

      const tests = expectedSectionTitles.map(async title => {
        const sectionTitle = await page.$eval(
          `[data-featured-section-title="${title}"]`,
          el => el.textContent,
        );

        expect(sectionTitle).to.equal(title);

        return title;
      });

      return Promise.all(tests);
    });

    it('renders featured items for each featured content section', () => {
      const featuredSectionIds = [
        'news-events',
        'Day-to-day',
        'healthy-mind-body',
        'legal-and-your-rights',
        'inspiration',
        'science-nature',
        'art-culture',
        'history',
        'music',
        'games',
      ];

      const tests = featuredSectionIds.map(async sectionId => {
        const featuredSection = await page.$(
          `[data-featured-section-id="${sectionId}"]`,
        );
        const featuredItems = await featuredSection.$$eval(
          '[data-featured-item-id]',
          node => node.length,
        );

        expect(featuredItems).to.be.greaterThan(2);

        return sectionId;
      });

      return Promise.all(tests);
    });

    it('navigates to the correct content for a featured event', async () => {
      const featuredItem = await page.$('[data-featured-item-id]:first-child');
      const featuredId = await featuredItem.$eval('[data-featured-id]', node =>
        node.getAttribute('data-featured-id'),
      );
      const featuredTitle = await featuredItem.$eval(
        '[data-featured-title]',
        node => node.getAttribute('data-featured-title'),
      );

      const [response] = await Promise.all([
        page.waitForNavigation(),
        featuredItem.click(),
      ]);

      const responseText = await response.text();

      expect(response.url()).to.contain(`/content/${featuredId}`);
      expect(responseText).to.contain(featuredTitle);
    });
  });
});
