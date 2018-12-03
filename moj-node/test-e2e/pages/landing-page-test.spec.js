const puppeteer = require('puppeteer');

const config = require('../config');

describe('Landing page', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  describe('Navigating to a landing page', () => {
    before(async () => {
      await page.goto(config.appURL);
    });

    it('renders the correct page title', async () => {
      // click on the news more btn
      await page.click('[data-more-btn-id="news-events"]');

      const pageTitle = await page.title();

      expect(pageTitle).to.equal('foo');
    });
  });
});
