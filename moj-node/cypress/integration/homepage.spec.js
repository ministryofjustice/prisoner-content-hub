describe('homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });
  it('contains navigation', () => {
    cy.get('params.categoryTitle')
      .should('contain', 'Home')
      .should('contain', 'Education');
  });

  it('navigates to the eduction page', () => {
    cy.get('.govuk-hub-main_navigation > :nth-child(2) > .govuk-link').click();

    cy.location('pathname').should('include', 'content');
  });
});

// it('renders featured content titles', () => {
//     // https://on.cypress.io/should
//     cy.get('data-featured-section-title').should('contain', 'News and events');
// });
