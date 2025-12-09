/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      addBun(bunName: string): Chainable<void>;
      addIngredient(ingredientName: string): Chainable<void>;
    }
  }
}

// Команда для добавления булки в конструктор
Cypress.Commands.add('addBun', (bunName: string) => {
  cy.contains('li', bunName).find('button').contains('Добавить').click();
});

// Команда для добавления ингредиента в конструктор
Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.contains('li', ingredientName).find('button').contains('Добавить').click();
});

export {};




