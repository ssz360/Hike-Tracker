/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('validate if all the required data are inserted', () => {
    beforeEach(() => {
        cy.visit('/login');

        cy.get('[name="username"]').type('davidwallace@gmail.com');
        cy.get('[name="password"]').type('123abcABC!');
        cy.get("button[type='submit']").click();
        cy.visit('/profile/preferences');
    });
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it("change range slider values and test if the data has saved", () => {

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.wait(1000);

        cy.get('input[data-test="length"]').then(($range) => {
            // get the DOM node
            const range = $range[0];
            // set the value manually
            nativeInputValueSetter.call(range, 10);
            // now dispatch the event
            range.dispatchEvent(new Event('change', { value: 10, bubbles: true }));
        });

        cy.get('input[data-test="ascent"]').then(($range) => {
            const range = $range[0];
            nativeInputValueSetter.call(range, 800);
            range.dispatchEvent(new Event('change', { value: 800, bubbles: true }));
        });
        cy.get('input[data-test="time"]').then(($range) => {
            const range = $range[0];
            nativeInputValueSetter.call(range, 10);
            range.dispatchEvent(new Event('change', { value: 10, bubbles: true }));
        });

        cy.get('button[data-test="save-btn"]').click();
        cy.wait(1000);

        cy.reload();

        cy.wait(1000);

        cy.get('input[data-test="length"]').each(el => {
            console.log(el[0].value);
            expect(+el[0].value).eql(10);
        });

        cy.get('input[data-test="ascent"]').each(el => {
            console.log(el[0].value);
            expect(+el[0].value).eql(800);
        });

        cy.get('input[data-test="time"]').each(el => {
            console.log(el[0].value);
            expect(+el[0].value).eql(10);
        });

    });
})