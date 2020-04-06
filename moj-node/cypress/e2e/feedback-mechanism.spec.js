describe('Feedback mechanism', () => {
  beforeEach(() => {
    cy.visit('/content/3151');
  });
  describe('When a user clicks the like button', () => {
    it('it sends the correct events', () => {
      cy.window().its('_feedback').should('exist');

      ['id', 'title', 'url', 'contentType'].forEach(property => {
        cy.window().its('_feedback').should('have.property', property);
      });

      cy.get('.govuk-hub-thumbs--up').click();

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'sentiment', 'LIKE');

      const comment = 'Hello world!';

      cy.get('.govuk-textarea').type(comment);

      cy.get('#feedback-widget').within(() => {
        cy.get('.govuk-button').click();
      });

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'comment', comment);
    });
  });

  describe('When a user clicks the dislike button', () => {
    it('it sends the correct events', () => {
      cy.window().its('_feedback').should('exist');

      ['id', 'title', 'url', 'contentType'].forEach(property => {
        cy.window().its('_feedback').should('have.property', property);
      });

      cy.get('.govuk-hub-thumbs--down').click();

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'sentiment', 'DISLIKE');

      const comment = 'Hello world!';

      cy.get('.govuk-textarea').type(comment);

      cy.get('#feedback-widget').within(() => {
        cy.get('.govuk-button').click();
      });

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'comment', comment);
    });
  });
});

describe('Feedback mechanism on search page', () => {
  const searchQuery = 'foobar';
  beforeEach(() => {
    cy.visit(`/search?query=${searchQuery}`);
  });
  describe('When a user clicks the like button', () => {
    it('it sends the correct events', () => {
      cy.window().its('_feedback').should('exist');

      ['id', 'title', 'url', 'contentType'].forEach(property => {
        cy.window().its('_feedback').should('have.property', property);
      });

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'title', searchQuery);

      cy.get('.govuk-hub-thumbs--up').click();

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'sentiment', 'LIKE');

      const comment = 'Hello world!';

      cy.get('.govuk-textarea').type(comment);

      cy.get('#feedback-widget').within(() => {
        cy.get('.govuk-button').click();
      });

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'comment', comment);
    });
  });

  describe('When a user clicks the dislike button', () => {
    it('it sends the correct events', () => {
      cy.window().its('_feedback').should('exist');

      ['id', 'title', 'url', 'contentType'].forEach(property => {
        cy.window().its('_feedback').should('have.property', property);
      });

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'title', searchQuery);

      cy.get('.govuk-hub-thumbs--down').click();

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'sentiment', 'DISLIKE');

      const comment = 'Hello world!';

      cy.get('.govuk-textarea').type(comment);

      cy.get('#feedback-widget').within(() => {
        cy.get('.govuk-button').click();
      });

      cy.window()
        .its('_feedback')
        .should('have.deep.property', 'comment', comment);
    });
  });
});
