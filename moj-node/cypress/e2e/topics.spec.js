describe('Topics page', () => {
  beforeEach(() => {
    cy.visit('/topics');
  });

  describe('Navigation', () => {
    it('contain the correct title and content', () => {
      const heading = 'h2';
      cy.get(heading).should('contain', 'Browse by topic');
      const topicListItems = '.govuk-hub-topics > ul > li';
      cy.get(topicListItems)
        .its('length')
        .should('be.gt', 0);
    });

    it('contains search', () => {
      const searchInput = '#search-wrapper #search';
      cy.get(searchInput).type('bob');
      const searchButton = '#search-wrapper button';
      cy.get(searchButton).click();
      cy.location('pathname').should('include', '/search');
    });

    it('contain a back link', () => {
      const backLink = '.govuk-back-link';
      cy.get(backLink).should('contain', 'Back to home');
      cy.get(backLink).click();
      cy.location('pathname').should('eq', '/');
    });
  });
});
