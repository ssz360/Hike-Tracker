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

    
    it("select on the map", () => {

        cy.contains("Select Area...").click();

        cy.get(".modal-body").contains("Submit").click();
        cy.contains("Move").should("be.visible");


        cy.get(".modal-body").get('.leaflet-touch')
            .trigger("mouseover")
            .trigger("mousedown", { which: 1 })
            .trigger("mousemove", { clientX: 10, clientY: 10, screenX: 10, screenY: 10, pageX: 10, pageY: 10 })
            .trigger("mouseup", { which: 1 });

        cy.contains("Clear").should("be.visible");

        cy.get(".modal-footer").contains("Submit").click();
    });

    it("")
})