/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('validate if all the required data are inserted', () => {

    beforeEach(() => {
        cy.visit('/login');
    
        cy.get('[name="username"]').type('davidwallace@gmail.com');
        cy.get('[name="password"]').type('123abcABC!');
        cy.contains("Submit").click();
        cy.visit('/localGuide/newHike');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    });



    it.only('insert hike', () => {

        cy.get(':nth-child(1) > .mx-auto').type("Exhausting bike trip");
        cy.get(':nth-child(2) > .mx-auto').select("HIKER");
        cy.get(':nth-child(3) > .mx-auto').type("Bike trip from Mondovì to Millesimo");
        cy.get('#formFile').selectFile("cypress/fixtures/gpxFiles/mondoviToMillesimoBikeTrip.gpx");
        cy.wait(100);
        cy.get('.btn-outline-success').click();
        cy.wait(100);
        cy.visit("/");
        cy.contains("Exhausting bike trip");

    });

});