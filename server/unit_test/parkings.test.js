jest.mock('../dao/dao');

const parkings = require('../dao/parkings');
const usersdao = require('../dao/users');
const fs = require('fs');
const { expect } = require('chai');
const db = require('../dao/__mocks__/dao');
const cleanupQueries = "DELETE FROM PARKINGS WHERE IDPoint != 5; DELETE FROM POINTS WHERE name = 'name'; DELETE FROM sqlite_sequence WHERE name = 'PARKINGS'; DELETE FROM sqlite_sequence WHERE name = 'POINTS';"

afterAll(async () => {
	db.exec(cleanupQueries, err => {
		if (err) console.log(err.message ? err.message : err.toString());
	});
	db.close();
});

describe('parkings dao', () => {
    test('get all parking lots', async () => {
        const pks = await parkings.getParkingsList();
        expect(pks.length).equal(1);
    });

    test('get all parking lots', async () => {
        let p = {
            name: 'name', coordinates: [45.0704363,7.6650265], desc: 'desc',slots:5
        }
        const pks = await parkings.addParking(p);
        expect(pks).to.be.greaterThan(1);
    })
})

// describe('parkings dao', () => {
//     const pk = {
//         "name": "JEST TEST",
//         "desc": "JEST TEST",
//         "slots": 100,
//         "coordinates": "",
//         "geographicalArea": "Piedmont"
//     };
//     test('add new parking lot', async () => {
//         await parkings.addParking(pk).then((res) => {
//             res.should.have.status(201);
//             res.body.should.be.empty;
//         })
//     });
// });