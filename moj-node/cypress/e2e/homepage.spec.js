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
          .should('contain', 'Education and work')
          .should('contain', 'Berwyn life')
          .should('contain', 'Getting out');
      });

      it(`navigates to the 'Education and work' page`, () => {
        const educationAndWork = `${cssNav} > :nth-child(2) > .govuk-link`;

        cy.get(educationAndWork).click();
        cy.location('pathname').should('include', '/content/3630');
      });

      it(`navigates to the 'Berwyn Life' page`, () => {
        const berwynLife = `${cssNav} > :nth-child(3) > .govuk-link`;

        cy.get(berwynLife).click();
        cy.location('pathname').should('include', '/content/3626');
      });

      it(`navigates to the 'Getting out' page`, () => {
        const gettingOutLink = `${cssNav} > :nth-child(4) > .govuk-link`;

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
        cy.get(`${cssNav} > :nth-child(2) > .govuk-link`).as(
          'educationAndWork',
        );

        cy.get('@educationAndWork').click();
        cy.location('pathname').should('include', '/content/3630');
      });

      it(`navigates to the 'Getting out' page`, () => {
        cy.get(`${cssNav} > :nth-child(3) > .govuk-link`).as('gettingOutLink');

        cy.get('@gettingOutLink').click();
        cy.location('pathname').should('include', '/content/3631');
      });
    });
  });

  describe('Featured content and landing pages', () => {
    const featuredSectionIds = [
      'news-events',
      'healthy-mind-body',
      'legal-and-your-rights',
      'inspiration',
      'science-nature',
      'art-culture',
      'history',
      'music',
    ];

    beforeEach(() => {
      cy.visit('/');
    });

    featuredSectionIds.forEach(id => {
      it(`renders featured section correctly for ${id}`, () => {
        cy.log('Check featured content items are rendered');

        cy.get(
          `[data-featured-section-id="${id}"] [data-featured-item-id]`,
        ).should('have.length.greaterThan', 0);

        cy.get(
          `[data-featured-section-id="${id}"] [data-featured-section-title]`,
        ).then($el => {
          const title = $el.attr('data-featured-section-title');
          cy.log(`Navigating to ${title} landing page`);
          cy.get(
            `[data-featured-section-id="${id}"] [data-more-btn-id]`,
          ).click();
          cy.get('#title').should('have.text', title);
        });
      });
    });
  });
});
