/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('start, pause, resume, finish trips', () => {
    beforeEach(() => {
        cy.visit('/login');

        cy.get('[name="username"]').type('davidwallace@gmail.com');
        cy.get('[name="password"]').type('123abcABC!');
        cy.get("button[type='submit']").click();
        cy.visit('/hikes');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it("start a new trip", () => {


        cy.get("#hikecard1").then(el => {
            if (el.find('div[data-test="start-trip"]')) {
                cy.get('div[data-test="start-trip"]').first().click();
                cy.get('svg[data-test="start-trip-overlay"]').first().click();
                cy.contains("unfinished hike").should("be.visible");
            }
        })


    });

    it("pause and resume a trip", () => {
        cy.visit('/profile/hikes');

        cy.get("body").then($body => {
            // pause
            if (cy.contains("unfinished hike to complete")) {
                if ($body.find('svg[data-test-status="clock-false"]').length > 0) {
                    cy.get('svg[data-test="stop-watch"]').first().click();
                    cy.get('svg[data-test-status="clock-true"]').should("exist");
                } else {
                    cy.get('svg[data-test="stop-watch"]').first().click();
                    cy.get('svg[data-test-status="clock-false"]').should("exist");
                }
            }
            //resume
            if (cy.contains("unfinished hike to complete")) {
                if ($body.find('svg[data-test-status="clock-false"]').length > 0) {
                    cy.get('svg[data-test="stop-watch"]').first().click();
                    cy.get('svg[data-test-status="clock-true"]').should("exist");
                } else {
                    cy.get('svg[data-test="stop-watch"]').first().click();
                    cy.get('svg[data-test-status="clock-false"]').should("exist");
                }
            }
        });
    });


    it("stop a trip", () => {
        cy.visit('/profile/hikes');

        if (cy.contains("unfinished hike to complete")) {
            cy.get('button[data-test="finish"]').click();
            cy.get('button[data-test="finish-hike"]').click();
            cy.contains("You don't have any hike to complete!").should("be.visible");
        }

    });

})