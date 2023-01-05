jest.mock('../dao/dao');

const huts = require('../dao/huts');
const usersdao = require('../dao/users');
const fs = require('fs');
const { expect } = require('chai');

describe('huts dao', () => {
    test('get all huts (with filters)', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, null, null, null, null, null);
        expect(hutslist.length).equal(7);
    })

    test('get all huts', async () => {
        const hutslist = await huts.getHutsList();
        expect(hutslist.length).equal(7);
    })

    test('get huts named rifugio*', async () => {
        const hutslist = await huts.getHutsListWithFilters("rifugio", null, null, null, null, null);
        expect(hutslist.length).equal(4);
    })

    test('get huts named bivacco*', async () => {
        const hutslist = await huts.getHutsListWithFilters("bivacco", null, null, null, null, null);
        expect(hutslist.length).equal(2);
    })

    test('get huts in Italy', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, "Italy", null, null, null, null);
        expect(hutslist.length).equal(7);
    })

    test('get huts in France', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, "france", null, null, null, null);
        expect(hutslist.length).equal(0);
    })

    test('get huts with 10 guests*', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, null, 10, null, null, null);
        expect(hutslist.length).equal(0);
    })

    test('get huts with 10 bedrooms*', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, null, null, 10, null, null);
        expect(hutslist.length).equal(1);
    })

    test('get huts with [43.1234567, 5.1234567] coordinates', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, null, null, null, "43.1234567, 5.1234567", null);
        expect(hutslist.length).equal(7);
    })

    test('get huts in Piedmont', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, null, null, null, null, "Piedmont");
        expect(hutslist.length).equal(7);
    })

    test('get huts in Provence', async () => {
        const hutslist = await huts.getHutsListWithFilters(null, null, null, null, null, "provence");
        expect(hutslist.length).equal(0);
    })

    test('insert hut: name missing if', async () => {
        try {
            const hutslist = await huts.insertHut(null, "description", "numberOfBedrooms", "coordinate", "geopos", "altitude", "phone", "email", "website");
        } catch (error) {
            expect(error).equal('Name missing');
        }
    })
    test('insert hut: descriptions missing if', async () => {
        try {
            const hutslist = await huts.insertHut("name", null, "numberOfBedrooms", "coordinate", "geopos", "altitude", "phone", "email", "website");
        } catch (error) {
            expect(error).equal("Description missing");
        }
    })
    test('insert hut: number of bedrooms missing if', async () => {
        try {
            const hutslist = await huts.insertHut("name", "description", null, "coordinate", "geopos", "altitude", "phone", "email", "website");
        } catch (error) {
            expect(error).equal("numberOfBedrooms missing");
        }
    })
    test('insert hut: phone missing if', async () => {
        try {
            const hutslist = await huts.insertHut("name", "description", "numberOfBedrooms", "coordinate", "geopos", "altitude", null, "email", "website");
        } catch (error) {
            expect(error).equal("Phone missing");
        }
    })
    test('insert hut: email missing if', async () => {
        try {
            const hutslist = await huts.insertHut("name", "description", "numberOfBedrooms", "coordinate", "geopos", "altitude", "phone", null, "website");
        } catch (error) {
            expect(error).equal("Email missing");
        }
    })
    test('insert new hut', async () => {
        try {
            let geo = { province: 'test1', region: 'test2', country: 'test3' };
            const hutslist = await huts.insertHut("name", "description", 5, [5523, 668], geo, 9658, 65895, "email", "website");

            expect(hutslist).to.be.above(0)
        } catch (error) {
            console.log(error);
        }
    })






})