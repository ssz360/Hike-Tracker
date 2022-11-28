jest.mock('../dao/dao');

const parkings=require('../dao/parkings');
const usersdao=require('../dao/users');
const fs=require('fs');
const { expect } = require('chai');

describe('parkings dao', () => {
    test('get all parking lots', async () => {
        const pks=await parkings.getParkingsList();
        expect(pks.length).equal(4);
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