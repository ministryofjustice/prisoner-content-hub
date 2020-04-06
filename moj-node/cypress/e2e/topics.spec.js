describe('Topics page', () => {
  beforeEach(() => {
    cy.visit('/topics');
  });

  describe('Navigation', () => {
    it('contain the correct title', () => {
      const heading = 'h1';
      cy.get(heading).should('contain', 'Browse the Content Hub');
      const topicListItems = '.hub-topics > dl dt';
      cy.get(topicListItems).its('length').should('be.gt', 0);
    });

    it('contains search', () => {
      const searchInput = '#search-wrapper #search';
      cy.get(searchInput).type('bob');
      const searchButton = '#search-wrapper button';
      cy.get(searchButton).click();
      cy.location('pathname').should('include', '/search');
    });
  });
});
