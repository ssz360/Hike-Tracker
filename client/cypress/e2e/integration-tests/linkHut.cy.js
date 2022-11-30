/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('validate if all the required data are inserted', () => {

    beforeEach(() => {
        cy.visit('/login');
    
        cy.get('[name="username"]').type('davidwallace@gmail.com');
        cy.get('[name="password"]').type('123abcABC!');
        cy.contains("Submit").click();
        cy.visit('/localGuide/hikes');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    });



    it.only('set the point as Start point', () => {

        
        cy.contains("Afframont").click().parent().parent().parent().parent().parent().contains("Link new hut!").click();;
        
        for (let i = 0; i < 5; i++) cy.get('.leaflet-control-zoom-out').click();

        cy.wait(1000);

        cy.get(".map-point").last().click();

        cy.get(".btn.btn-outline-success").click();

        cy.get(".alert-heading.h4").should("be.visible");

    });



});