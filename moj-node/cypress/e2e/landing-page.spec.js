describe('Landing page', () => {
  const landingPages = {
    newsAndEvents: '/content/3632',
    heathyMindAndBody: '/content/3657',
    legalAndYourRights: '/content/3658',
    inspiration: '/content/3659',
    artAndCultures: '/content/3661',
    history: '/content/3699',
    music: '/content/3662',
  };

  Object.keys(landingPages).forEach(key => {
    it(`renders a ${key} landing page`, () => {
      cy.visit(landingPages[key]);

      // cy.log('Should have some navigation menu items');
      // cy.get('.help-block li').should('have.length.of.at.least', 1);

      // cy.log('Check that featured content is rendered on the page');
      // cy.get('[data-featured-id]').then($el => {
      //   const initialNumOfFeatured = $el.length;

      //   expect(initialNumOfFeatured).to.be.at.least(1);

      //   cy.log('Navigate to one of the featured content');

      //   cy.get('[data-featured-id]')
      //     .last()
      //     .then($ref => {
      //       cy.openLinkOrPDF($ref);
      //     });
      // });
    });
  });
});
