/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('validate if all the required data are inserted', () => {
    beforeEach(() => {
        cy.visit('/parking');
    });

    it("just click on the 'save' button", () => {
        cy.contains("Save").click();
    });

    it("Enter the title but not Description",()=>{
        cy.contains('Title').parent().children('input').type('test title');
        cy.contains("Save").click();
    });

    it("insert all require data",()=>{
        cy.contains('Title').parent().children('input').type('test title');
        cy.contains('Description').parent().children('textarea').type('Some random descriptions');
        cy.contains("Save").click();
    })
})