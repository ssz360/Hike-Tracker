/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('validate if all the required data are inserted', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it("just click on the 'Submit' button", () => {
        cy.contains("Submit").click();
    });

    it("Just enter the username",()=>{
        cy.get('[name="username"]').type('username');
        cy.contains("Submit").click();
    });

    it("insert wrong username password",()=>{
        cy.get('[name="username"]').type('username');
        cy.get('[name="password"]').type('password');
        cy.contains("Submit").click();
        cy.contains("username or password wrong").should("be.visible");
    })

    it("insert correct username password",()=>{
        cy.get('[name="username"]').type('username');
        cy.get('[name="password"]').type('password');
        cy.contains("Submit").click();
        cy.contains("should be completed when the site works").should("be.visible");
    })
})