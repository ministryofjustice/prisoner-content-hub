// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

function convertPageContentFor(s) {
  const specialCharacters = /[']/g;
  const withHtmlEntity = m => `&#${m.charCodeAt(0)};`;
  return s.replace(specialCharacters, withHtmlEntity);
}

Cypress.Commands.add('openLinkOrPDF', $ref => {
  const title = $ref.find('[data-featured-title]').attr('data-featured-title');
  const url = $ref.attr('href');
  const opensNewTab = $ref.attr('target');

  cy.log(`Navigating to ${title}`);

  if (opensNewTab) {
    cy.log('Opening a pdf');
    cy.request(url).then(response => {
      expect(response.headers['content-type']).to.equal('application/pdf');
    });
  } else {
    cy.request(url)
      .its('body')
      .should(
        'match',
        new RegExp(`<h1 .+>${convertPageContentFor(title)}</h1>`),
      );
  }
});
