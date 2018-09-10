const puppeteer = require('puppeteer');

describe('Home page', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  after(async () => {
    await browser.close();
  });

  describe('News and event featured items', () => {
    let container;
    before(async () => {
      container = await page.$('[data-featured-section-id="news-events"]');
    });

    it('renders the correct section title', async () => {
      const sectionTitle = await container.$eval('[data-featured-section-title]', node => node.textContent);

      expect(sectionTitle).to.equal('News and events');
    });

    it('renders the correct number of news and event featured items', async () => {
      const featuredItemsCount = await container.$$eval('[data-featured-item-id]', node => node.length);

      expect(featuredItemsCount).to.equal(4);
    });

    it('navigates to the correct content for a featured event', async () => {
      const featuredEvent = await container.$('[data-featured-item-id]:first-child');


      const featuredId = await featuredEvent.$eval('[data-featured-id]', node => node.getAttribute('data-featured-id'));
      const featuredTitle = await featuredEvent.$eval('[data-featured-title]', node => node.getAttribute('data-featured-title'));

      const [response] = await Promise.all([
        page.waitForNavigation(),
        featuredEvent.click(),
      ]);

      const responseText = await response.text();

      expect(response.url()).to.contain(`/content/${featuredId}`);
      expect(responseText).to.contain(featuredTitle);
    });
  });
});
