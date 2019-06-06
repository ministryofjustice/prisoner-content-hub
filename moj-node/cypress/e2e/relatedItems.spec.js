describe('Secondary tag page related content', () => {
  describe('when there are more related content', () => {
    it('loads more related content', function test() {
      cy.server({
        method: 'GET',
      });

      // cy.fixture('relatedContent').then(relatedContent => {
      //   cy.route('/tags/related-content/*', relatedContent);
      // });
      cy.fixture('relatedContent').as('relatedContentJSON');

      cy.route('/tags/related-content/*', '@relatedContentJSON');

      cy.log('Visiting the music page');
      cy.visit('/tags/785');

      cy.log('Check that content rendered on the page');

      cy.get('[data-featured-id]').then($el => {
        const initialNumOfFeatured = $el.length;

        expect(initialNumOfFeatured).to.be.at.least(initialNumOfFeatured);

        cy.log('Ensure more related content are loaded');
        cy.scrollTo('bottom');

        cy.get('[data-featured-id]').should('have.length.of.at.least', 12);
      });

      cy.get('#related-contents').then($el => {
        const firstItemTitle = this.relatedContentJSON[0].title;
        const text = $el.text();

        expect(text).to.contain(firstItemTitle);
      });
    });
  });

  describe('when there is no data to load', () => {
    it('does not load new data', () => {
      cy.server({
        method: 'GET',
        status: 200,
      });

      cy.route('/tags/related-content/*', []);

      cy.log('Visiting the music page');
      cy.visit('/tags/785');

      cy.log('Check that content rendered on the page');

      cy.get('[data-featured-id]').then($el => {
        const initialNumOfFeatured = $el.length;

        expect(initialNumOfFeatured).to.be.at.least(initialNumOfFeatured);

        cy.scrollTo('bottom');

        cy.get('[data-featured-id]').should(
          'have.length',
          initialNumOfFeatured,
        );
      });
    });

    it('handles errors gracefully', () => {
      cy.server({
        method: 'GET',
        status: 500,
      });

      cy.route('/tags/related-content/*', {});

      cy.log('Visiting the music page');
      cy.visit('/tags/785');

      cy.log('Check that content rendered on the page');

      cy.get('[data-featured-id]').then($el => {
        const initialNumOfFeatured = $el.length;

        expect(initialNumOfFeatured).to.be.at.least(1);

        cy.scrollTo('bottom');

        cy.get('[data-featured-id]').should(
          'have.length',
          initialNumOfFeatured,
        );
      });
    });
  });
});
