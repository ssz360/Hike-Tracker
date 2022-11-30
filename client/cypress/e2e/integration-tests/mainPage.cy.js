/* eslint-disable no-undef */
/// <reference types="cypress" />


// describe('new insertion test.', () => {

//     this is just for prof of work of how can move the map
//     it("*move the map", () => {
//         cy.get('.leaflet-touch')
//             .trigger("mouseover")
//             .trigger("mousedown", { which: 1 })
//             .trigger("mousemove", { clientX: 100, clientY: 100, screenX: 100, screenY: 100, pageX: 100, pageY: 100 })
//             .trigger("mouseup", { which: 1 })
//     })
// });


// **********************************************

describe("filter hikes", () => {
    beforeEach(() => {
        cy.visit('/');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })



    it.only('check the difficulty', () => {

        cy.get("select").should('be.visible').select('Hiker', { force: true });
        cy.get("button[type='submit']").click();
        cy.wait(1000);
        cy.get(".test-difficulty").each(el => {
            console.log(el[0]);
            expect(el[0].innerText.toLocaleLowerCase()).equal("hiker");
        });


        cy.get("select").should('be.visible').select('Tourist', { force: true });
        cy.get("button[type='submit']").click();
        cy.wait(1000);
        cy.get(".test-difficulty").each(el => {
            console.log(el[0]);
            expect(el[0].innerText.toLocaleLowerCase()).equal("tourist");
        });

    });

    it.only('check the select area', () => {

        cy.get('.justify-content-md-center > :nth-child(1) > .d-grid > .btn').click();
        cy.get('.leaflet-control > .btn').click();
        cy.get('.leaflet-container').trigger('mousedown', { position: "center" }).trigger('mouseup', { position: "top" }).trigger('mousemove', { position: "top" }).trigger("mouseout");
        cy.get('.modal-footer > .btn').click();
        cy.get('form > .d-grid > .btn').click();
        cy.wait(100);
        cy.contains("Rocciamelone").should('not.exist');
        cy.get('.justify-content-md-center > :nth-child(1) > .d-grid > .btn').click();
        cy.wait(100);

        for (let i = 0; i < 30; i++) cy.get('.leaflet-control-zoom-out').click();
        cy.get(':nth-child(3) > .leaflet-control > :nth-child(1)').click();
        cy.get('.leaflet-container').trigger('mousedown', { position: "center" }).trigger('mouseup', { position: "top" }).trigger('mousemove', { position: "top" }).trigger("mouseout");
        cy.get('.modal-footer > .btn').click();
        cy.get('form > .d-grid > .btn').click();
        cy.wait(100);
        cy.contains("Rocciamelone");
    });

    it.only('check the length', () => {
        cy.get('[aria-label="Lenght Min"]').type("3");

        cy.get("button[type='submit']").click();
         cy.wait(300);

        cy.get(".test-length").each(el => {
            console.log(el[0]);
            expect(+el[0].innerText).greaterThan(2);
        });

        cy.get('[aria-label="Lenght Max"]').type("5");

        cy.get("button[type='submit']").click();
        cy.wait(300);
        cy.get(".test-length").each(el => {
            console.log(el[0]);
            expect(+el[0].innerText).lessThan(6);
        });
    });


    it.only('check the Ascent', () => {
        cy.get('[aria-label="Ascent Min"]').type("500");

        cy.get("button[type='submit']").click();
         cy.wait(300);

        cy.get(".test-ascent").each(el => {
            console.log(el[0]);
            expect(+el[0].innerText).greaterThan(500);
        });

        cy.get('[aria-label="Ascent Max"]').type("2000");

        cy.get("button[type='submit']").click();
        cy.wait(300);
        cy.get(".test-ascent").each(el => {
            console.log(el[0]);
            expect(+el[0].innerText).lessThan(2000);
        });
    });

    it.only('check the Time Expected', () => {
        cy.get('[aria-label="Time Min"]').type("3");

        cy.get("button[type='submit']").click();
         cy.wait(300);

        cy.get(".test-time").each(el => {
            console.log(el[0]);
            expect(+el[0].innerText).greaterThan(3);
        });

        cy.get('[aria-label="Time Max"]').type("7");

        cy.get("button[type='submit']").click();
        cy.wait(300);
        cy.get(".test-time").each(el => {
            console.log(el[0]);
            expect(+el[0].innerText).lessThan(7.5);
        });
    });
})