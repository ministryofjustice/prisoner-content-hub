describe('Homepage', () => {
  describe('Berwyn', () => {
    beforeEach(() => {
      cy.visit('/?prison=berwyn');
    });

    describe('Navigation', () => {
      it('contains the correct number of items of popular topics', () => {
        const popularTopics = '.popular-topics';
        cy.get(popularTopics).should('contain', 'Popular topics');
        cy.get(popularTopics)
          .get('ul > li')
          .should('have.length', 9);
      });

      it('contains a link to browse all topics', () => {
        const browseAllTopics = '.govuk-button--start';
        cy.get(browseAllTopics).should('contain', 'Browse all topics');
        cy.get(browseAllTopics).click();
        cy.location('pathname').should('include', '/topics');
      });

      it('contains search', () => {
        const searchInput = '#search-wrapper #search';
        cy.get(searchInput).type('bob');
        const searchButton = '#search-wrapper button';
        cy.get(searchButton).click();
        cy.location('pathname').should('include', '/search');
      });

      // it('contains the correct number of featured content', () => {
      //   const featuredContent = '[data-featured-tile-id]';
      //   cy.get(featuredContent).should('have.length', 6);
      //   cy.get(featuredContent)
      //     .first()
      //     .click();
      //   cy.location('pathname').should('include', '/content');
      // });
    });
  });

  describe('Wayland', () => {
    beforeEach(() => {
      cy.visit('/?prison=wayland');
    });

    describe('Navigation', () => {
      // it('contains the correct number of featured content', () => {
      //   const featuredContent = '[data-featured-tile-id]';
      //   cy.get(featuredContent).should('have.length', 6);
      //   cy.get(featuredContent)
      //     .first()
      //     .click();
      //   cy.location('pathname').should('include', '/content');
      // });
    });
  });
});
