describe('Homepage', () => {
  describe('Berwyn', () => {
    beforeEach(() => {
      cy.visit('/?prison=berwyn');
    });

    describe('Navigation', () => {
      const cssNav = '.govuk-hub-main_navigation';
      it('contains the correct items in the navigation', () => {
        cy.get(cssNav)
          .should('contain', 'Home')
          .should('contain', 'Working in Berwyn')
          .should('contain', 'Getting out');
      });

      it(`navigates to the 'Working in Berwyn' page`, () => {
        const workingInBerwynLink = `${cssNav} > :nth-child(2) > .govuk-link`;

        cy.get(workingInBerwynLink).click();
        cy.location('pathname').should('include', '/working-in-berwyn');
      });

      it(`navigates to the 'Getting out' page`, () => {
        const gettingOutLink = `${cssNav} > :nth-child(3) > .govuk-link`;

        cy.get(gettingOutLink).click();
        cy.location('pathname').should('include', '/content/3631');
      });
    });
  });

  describe('In Wayland', () => {
    beforeEach(() => {
      cy.visit('/?prison=wayland');
    });

    describe('Navigation', () => {
      const cssNav = '.govuk-hub-main_navigation';

      it('contains the correct items in the navigation', () => {
        cy.get(cssNav)
          .should('contain', 'Home')
          .should('contain', 'Education and work')
          .should('contain', 'Getting out');
      });

      it(`navigates to the 'Education and work' page`, () => {
        const workingInBerwynLink = `${cssNav} > :nth-child(2) > .govuk-link`;

        cy.get(workingInBerwynLink).click();
        cy.location('pathname').should('include', '/content/3630');
      });

      it(`navigates to the 'Getting out' page`, () => {
        const gettingOutLink = `${cssNav} > :nth-child(3) > .govuk-link`;

        cy.get(gettingOutLink).click();
        cy.location('pathname').should('include', '/content/3631');
      });
    });
  });
});

// it('renders featured content titles', () => {
//     // https://on.cypress.io/should
//     cy.get('data-featured-section-title').should('contain', 'News and events');
// });
