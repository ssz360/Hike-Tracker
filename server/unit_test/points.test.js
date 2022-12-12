jest.mock('../dao/dao');

const points=require('../services/points');
const hikesdao=require('../dao/hikes');
const usersdao=require('../dao/users');
const fs=require('fs');
const { expect } = require('chai');

const NEW_YORK={lat:40.730610,lng: -73.935242,alt:8,geopos:{country: "United States", province: "", region: "New York"}};
const TURIN={lat:45.116177, lng:7.742615,alt:213,geopos:{country: "Italy", province: "Torino", region: "Piedmont"}};
const MILAN={lat:45.464664, lng:9.188540,alt:139,geopos:{country: "Italy", province: "Milan", region: "Lombardy"}};
const INVALIDLAT={lat:96,lng:90,alt:422,geopos:422};
const INVALIDLNG={lat:54,lng:529,alt:422,geopos:422};
const INVALIDCOORDS={lat:124,lng:240,alt:422,geopos:422};


describe('altitude',()=>{
    test('get altitude new york',async()=>{
        const latitude=await points.getAltitudePoint(NEW_YORK.lat,NEW_YORK.lng,true);
        expect(latitude).equal(NEW_YORK.alt);
    })

    test('get altitude turin',async()=>{
        const latitude=await points.getAltitudePoint(TURIN.lat,TURIN.lng,true);
        expect(latitude).equal(TURIN.alt);
    })


    test('get latitude milan',async()=>{
        const latitude=await points.getAltitudePoint(MILAN.lat,MILAN.lng,true);
        expect(latitude).equal(MILAN.alt);
    })

    test('get altitude invalid coordinates',async()=>{
        try {
            await points.getAltitudePoint(INVALIDLAT.lat,INVALIDLAT.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDLAT.alt);
            expect(error.message).equal("Invalid latitude, it should be between -90 and 90 degrees");
        }
    })

    test('get altitude invalid longitude',async()=>{
        try {
            await points.getAltitudePoint(INVALIDLNG.lat,INVALIDLNG.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDLNG.alt);
            expect(error.message).equal("Invalid longitude, it should be between -180 and 180 degrees");
        }
    })

    test('get altitude invalid coordinates',async()=>{
        try {
            await points.getAltitudePoint(INVALIDCOORDS.lat,INVALIDCOORDS.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDCOORDS.alt);
            expect(error.message).equal("Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees");
        }
    })

    test('get altitude undefined',async()=>{
        try {
            await points.getAltitudePoint(undefined,undefined,true);
        } catch (error) {
            expect(error.status).equal(422);
            expect(error.message).equal('Bad parameters');
        }
    })
})


describe('geographical area',()=>{
    test('get geographical area new york',async()=>{
        const geopos=await points.getGeoAreaPoint(NEW_YORK.lat,NEW_YORK.lng,true);
        expect(geopos.country).equal(NEW_YORK.geopos.country);
        expect(geopos.region).equal(NEW_YORK.geopos.region);
        expect(geopos.province).equal(NEW_YORK.geopos.province);
    })

    test('get geographical area turin',async()=>{
        const geopos=await points.getGeoAreaPoint(TURIN.lat,TURIN.lng,true);
        expect(geopos.country).equal(TURIN.geopos.country);
        expect(geopos.region).equal(TURIN.geopos.region);
        expect(geopos.province).equal(TURIN.geopos.province);
    })


    test('get geographical area milan',async()=>{
        const geopos=await points.getGeoAreaPoint(MILAN.lat,MILAN.lng,true);
        expect(geopos.country).equal(MILAN.geopos.country);
        expect(geopos.region).equal(MILAN.geopos.region);
        expect(geopos.province).equal(MILAN.geopos.province);
    })

    test('get geographical area invalid coordinates',async()=>{
        try {
            await points.getGeoAreaPoint(INVALIDLAT.lat,INVALIDLAT.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDLAT.geopos);
            expect(error.message).equal("Invalid latitude, it should be between -90 and 90 degrees");
        }
    })

    test('get geographical area invalid longitude',async()=>{
        try {
            await points.getGeoAreaPoint(INVALIDLNG.lat,INVALIDLNG.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDLNG.geopos);
            expect(error.message).equal("Invalid longitude, it should be between -180 and 180 degrees");
        }
    })

    test('get geographical area invalid coordinates',async()=>{
        try {
            await points.getGeoAreaPoint(INVALIDCOORDS.lat,INVALIDCOORDS.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDCOORDS.geopos);
            expect(error.message).equal("Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees");
        }
    })
    test('get geopos undefined',async()=>{
        try {
            await points.getGeoAreaPoint(undefined,undefined,true);
        } catch (error) {
            expect(error.status).equal(422);
            expect(error.message).equal('Bad parameters');
        }
    })
})