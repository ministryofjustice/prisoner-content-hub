describe('Feedback mechanism', () => {
  before(() => {
    cy.visit('/content/3151');
  });
  describe('When a user clicks the like event', () => {
    it('it sends the correct events', () => {
      cy.window()
        .its('_paq.length')
        .should('equal', 5);

      cy.get('.govuk-hub-thumbs--up').click();

      cy.window()
        .its('_paq.length')
        .should('equal', 7);

      cy.window().then(({ _paq: piwikQueue }) => {
        const [eventType, contentType, action, label] = piwikQueue[
          piwikQueue.length - 1
        ];

        expect(eventType).to.equal('trackEvent');
        expect(contentType).to.equal('video');
        expect(action).to.equal('LIKE');

        const labelValues = label.split('|');

        expect(labelValues.length).to.equal(9);
      });
    });
  });
});
