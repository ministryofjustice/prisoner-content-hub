describe('404', () => {
  it('renders a 404 page', () => {
    cy.visit('/unknown-page', { failOnStatusCode: false });

    cy.get('#title').should(
      'have.text',
      'The page you are looking for could not be found',
    );
  });
});
