describe('Secondary tag page', () => {
  const landingPages = {
    employmentTrainingEducation: '/tags/827',
  };

  Object.keys(landingPages).forEach(key => {
    it(`renders the ${key} tag page`, () => {
      cy.visit(landingPages[key]);

      cy.log('Check that content rendered on the page');
      cy.get('[data-featured-id]').then($el => {
        const initialNumOfFeatured = $el.length;

        expect(initialNumOfFeatured).to.be.at.least(1);

        cy.log('Ensure more related content are loaded');
        cy.scrollTo('bottom');

        cy.get('[data-featured-id]').should(
          'have.length.of.at.least',
          initialNumOfFeatured,
        );

        cy.log('Navigate to one of the related content');

        cy.get('[data-featured-id]')
          .last()
          .then($ref => {
            cy.openLinkOrPDF($ref);
          });
      });
    });
  });
});
