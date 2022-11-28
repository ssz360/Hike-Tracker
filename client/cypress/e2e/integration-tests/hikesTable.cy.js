/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('new insertion test.', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it("insert empty form", () => {
        cy.contains('Submit').click();
        cy.contains('Error').should("be.visible");
    });

    it('Enter all data but GPX file', () => {

        cy.get("form").contains('Hike Name').parent().children('input').type('new test hike');
        cy.get("form").contains('Hike Difficulty').parent().children('select').select('Hiker');
        cy.get("form").contains('Hike Description').parent().children('input').type('this is a new test hike');


        cy.contains('Submit').click();
        cy.contains('Error').should("be.visible");
    });


    it('select all fields',()=>{
       
        
        cy.get("form").contains('Hike Name').parent().children('input').type('new test hike');
        cy.get("form").contains('Hike Difficulty').parent().children('select').select('Hiker');
        cy.get("form").contains('Hike Description').parent().children('input').type('this is a new test hike');


        cy.request('https://gist.githubusercontent.com/cly/bab1a4f982d43bcc53ff32d4708b8a77/raw/68f4f73aa30a7bdc4100395e8bf18bf81e1f6377/sample.gpx').its('body').as('responseBody')

        cy.get('#formFile').selectFile('@responseBody')

        cy.contains('Submit').click();
        
    });
});