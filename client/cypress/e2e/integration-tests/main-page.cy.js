/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('select listboxes and click search', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    
    it("if all the listboxes' default options are selected at first", () => {
        cy.get("select").each((el, index, list) => {
            el[0].selectedIndex = 1;
        });

        cy.get("button[type='submit']").click();
    });
})