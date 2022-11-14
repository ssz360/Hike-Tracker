/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('new insertion test.', () => {
    beforeEach(() => {
        cy.visit('/hikes');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    // it("there should be more than 0 hikes",()=>{
    //     cy.get(".info-card.card").should("be.visible");
    // });

    // it("if click on more the data should be appeared",()=>{
    //     cy.get(".info-card.card").first().contains("More").click();
    //     cy.get(".more-key").should("be.visible");
    // });

    // this is just for prof of work of how can move the map
    it("*move the map", () => {
        cy.get('.leaflet-touch')
            .trigger("mouseover")
            .trigger("mousedown", { which: 1 })
            .trigger("mousemove", { clientX: 100, clientY: 100, screenX: 100, screenY: 100, pageX: 100, pageY: 100 })
            .trigger("mouseup", { which: 1 })
    })
});