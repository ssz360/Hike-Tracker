/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('validate if all the required data are inserted', () => {
    beforeEach(() => {
        cy.visit('/login');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it("just click on the 'Submit' button", () => {
        cy.get("button[type='submit']").click();
    });

    it("Just enter the username",()=>{
        cy.get('[name="username"]').type('username');
        cy.get("button[type='submit']").click();
    });

    it("insert wrong username password",()=>{
        cy.get('[name="username"]').type('username');
        cy.get('[name="password"]').type('password');
        cy.get("button[type='submit']").click();
        cy.contains("username or password wrong").should("be.visible");
    })

    it("insert correct username password",()=>{
        cy.get('[name="username"]').type('davidwallace@gmail.com');
        cy.get('[name="password"]').type('123abcABC!');
        cy.get("button[type='submit']").click();
        cy.wait(100);
        cy.contains("Log out");
    })
})