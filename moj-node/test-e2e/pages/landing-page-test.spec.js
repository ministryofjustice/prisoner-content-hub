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
    beforeEach(async () => {
      await page.goto(config.appURL);
    });

    describe('News and events', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="news-events"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });

      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('News and events');
      });

      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });

    describe('Day to day', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="Day-to-day"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('Day-to-day');
      });
      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(4);
      });
    });

    describe('Healthy mind and body', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="healthy-mind-body"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('Healthy mind and body');
      });

      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });

    describe('Legal advice and your rights', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="legal-and-your-rights"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('Legal advice and your rights');
      });
      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });

    describe('Inspiration', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="inspiration"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('Inspiration');
      });

      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });

    describe('Science and nature', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="science-nature"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('Science and nature');
      });
      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });

    describe('Art and culture', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="art-culture"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('Art and culture');
      });
      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });

    describe('History', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="history"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('History');
      });
      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });

    describe('Music', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="music"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });
      it('renders the correct page title', async () => {
        const pageTitle = await page.$eval('#title', el => el.textContent);

        expect(pageTitle).to.equal('Music');
      });
      it('renders some related content', async () => {
        const relatedContent = await page.$$eval('[data-featured-id]', node => node.length);

        expect(relatedContent).to.be.greaterThan(7);
      });
    });


    describe('Landing page link', () => {
      beforeEach(async () => {
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click('[data-more-btn-id="music"]'), // Clicking the link will indirectly cause a navigation
        ]);
      });

      context('when a related content item is clicked', () => {
        it('navigate to the content page', async () => {
          const relatedContent = await page.$('[data-featured-id]:first-child');

          const relatedContentTitle = await relatedContent.$eval('[data-featured-title]', el => el.textContent);

          await Promise.all([
            page.waitForNavigation(), // The promise resolves after navigation has finished
            page.click('[data-featured-id]:first-child'), // Clicking the link will indirectly cause a navigation
          ]);

          const pageTitle = await page.$eval('#title', el => el.textContent);

          expect(pageTitle).to.equal(relatedContentTitle);
        });
      });
    });
  });
});
