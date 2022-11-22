/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('new insertion test.', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it("there should be more than 0 hikes",()=>{
        cy.get(".info-card.card").should("be.visible");
    });

    it("if click on more the data should be appeared",()=>{
        cy.get(".info-card.card").first().contains("More").click();
        cy.get(".more-key").should("be.visible");
    });

    it.only('filter map',()=>{
        cy.get('.justify-content-md-center > :nth-child(1) > .d-grid > .btn').click();
        cy.get('.leaflet-control > .btn').click();
        cy.get('.leaflet-container').trigger('mousedown',{position:"center"}).trigger('mouseup',{position:"top"}).trigger('mousemove',{position:"top"}).trigger("mouseout");
        cy.get('.modal-footer > .btn').click();
        cy.get('form > .d-grid > .btn').click();
        cy.wait(100);
        cy.contains("Rocciamelone").should('not.exist');
        cy.get('.justify-content-md-center > :nth-child(1) > .d-grid > .btn').click();
        cy.wait(100);
        for(let i=0;i<20;i++) cy.get('.leaflet-control-zoom-out').click();
        cy.get(':nth-child(3) > .leaflet-control > :nth-child(1)').click();
        cy.get('.leaflet-container').trigger('mousedown',{position:"center"}).trigger('mouseup',{position:"top"}).trigger('mousemove',{position:"top"}).trigger("mouseout");
        cy.get('.modal-footer > .btn').click();
        cy.get('form > .d-grid > .btn').click();
        cy.wait(100);
        cy.contains("Rocciamelone");
    })

    it.only('Rocciamelone hike',()=>{
        cy.contains('Rocciamelone');
    })

    it.only('Rocciamelone map shown on double click',()=>{
        cy.visit('/login');
        cy.get('#floatingInput').type("s292671@studenti.polito.it");
        cy.get('#floatingPassword').type("123abcABC!");
        cy.get('.btn').click();
        cy.wait(100);
        cy.get(':nth-child(6) > .card > .card-body > [style="height: 175px;"] > .leaflet-container').trigger('dblclick');
        cy.contains("This is the map for hike")
    })

    // this is just for prof of work of how can move the map
    // it("*move the map", () => {
    //     cy.get('.leaflet-touch')
    //         .trigger("mouseover")
    //         .trigger("mousedown", { which: 1 })
    //         .trigger("mousemove", { clientX: 100, clientY: 100, screenX: 100, screenY: 100, pageX: 100, pageY: 100 })
    //         .trigger("mouseup", { which: 1 })
    // })
});

describe("hikes list with filters", () => {
    beforeEach(() => {
        cy.visit('/');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })


})