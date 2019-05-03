describe('Landing page', () => {
  const landingPages = {
    newsAndEvents: '/content/3632',
    heathyMindAndBody: '/content/3657',
    // TODO: change Test Suite to electron when the following ticket is done https://github.com/cypress-io/cypress/issues/311
    legalAndYourRights: '/content/3658',
    inspiration: '/content/3659',
    scienceAndNature: '/content/3660',
    artAndCultures: '/content/3661',
    history: '/content/3699',
    music: '/content/3662',
  };

  Object.keys(landingPages).forEach(key => {
    it(`renders a ${key} landing page`, () => {
      cy.visit(landingPages[key]);

      cy.log('Should have some navigation menu items');
      cy.get('.govuk-hub-content-section-menu li').then($el => {
        expect($el.length).to.be.at.least(
          2,
          'Should have at least 2 menu items',
        );
      });

      cy.log('Check that featured content is rendered on the page');
      cy.get('[data-featured-id]').then($el => {
        const initialNumOfFeatured = $el.length;

        expect(initialNumOfFeatured).to.be.at.most(8);

        cy.log('Navigate to one of the featured content');

        cy.get('[data-featured-id]')
          .last()
          .then($ref => {
            const title = $ref
              .find('[data-featured-title]')
              .attr('data-featured-title');

            cy.log(`Navigating to ${title}`);
            cy.get('[data-featured-id]')
              .last()
              .click({ force: true });

            cy.document().then(({ contentType }) => {
              if (contentType === 'application/pdf') {
                cy.log('PDF opened successfully');
              } else {
                cy.get('#title').should('have.text', title);
              }
            });
          });
      });
    });
  });
});
