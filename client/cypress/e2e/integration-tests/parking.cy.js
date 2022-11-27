/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('validate if all the required data are inserted', () => {
    beforeEach(() => {
        cy.visit('/login');

        cy.get('[name="username"]').type('davidwallace@gmail.com');
        cy.get('[name="password"]').type('123abcABC!');
        cy.contains("Submit").click();
        cy.visit('/parking');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it("just click on the 'save' button", () => {
        cy.contains("Save").click();
        // errors should appear to show that required fields must be filled
        cy.contains("error").should("be.visible");
    });

    it("Enter the title but not Description", () => {
        cy.contains('Title').parent().children('input').type('test title');
        cy.contains("Save").click();
        // errors should appear to show that required fields must be filled
        cy.contains("error").should("be.visible");
    });

    it("insert all require data", () => {
        const title = "test title"
        cy.get('[placeholder="Name"]').type(title);
        cy.get('[placeholder="Description"]').type('Some random descriptions');
        cy.get('[data-test="total-cost"]').type('5');
        cy.get('[data-test="geo-area"]').type('Piemonte');

        cy.contains("Select point").click();
        cy.get(".leaflet-container").click();

        cy.contains("Submit").click();
        cy.contains("Save").click();

        cy.wait(300);


// console.log("555");
//         console.log(cy.get("td").last());
        

    })
})