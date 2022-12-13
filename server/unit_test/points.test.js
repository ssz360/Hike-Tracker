jest.mock('../dao/dao');

const points=require('../services/points');
const pointsdao=require('../dao/points');
const { expect } = require('chai');
const hikesdao = require('../dao/hikes');

const NEW_YORK={lat:40.730610,lng: -73.935242,alt:8,geopos:{country: "United States", province: "", region: "New York"}};
const TURIN={lat:45.116177, lng:7.742615,alt:213,geopos:{country: "Italy", province: "Torino", region: "Piedmont"}};
const MILAN={lat:45.464664, lng:9.188540,alt:139,geopos:{country: "Italy", province: "Milan", region: "Lombardy"}};
const INVALIDLAT={lat:96,lng:90,alt:422,geopos:422};
const INVALIDLNG={lat:54,lng:529,alt:422,geopos:422};
const INVALIDCOORDS={lat:124,lng:240,alt:422,geopos:422};
const DAVIDWALLACE={username:"davidwallace@gmail.com",type:"localGuide"};
const JOHNLAROCCIA={username:"johnlaroccia@gmail.com",type:"localGuide"};
const JOEHIKER={username:"joeloveshikes@gmail.com",type:"hiker"};
const ROCCIAMELONE={
    id: 1,
    name: 'Rocciamelone',
    author: 'davidwallace@gmail.com',
    length: 4.56489292313034,
    expectedTime: 2.28244646156517,
    ascent: 1353.053467,
    difficulty: 'PROFESSIONAL HIKER',
    startPoint: {
      id: 1,
      name: 'Point of hike Rocciamelone',
      geographicalArea: 'Torino, Piedmont, Italy',
      coordinates: [ 45.177786, 7.083372 ],       
      typeOfPoint: 'hikePoint'
    },
    endPoint: {
      id: 2,
      name: 'Point of hike Rocciamelone',
      geographicalArea: 'Torino, Piedmont, Italy',
      coordinates: [ 45.203531, 7.07734 ],
      typeOfPoint: 'hikePoint'
    },
    referencePoints: [
      {
        id: 1,
        name: 'Point of hike Rocciamelone',
        geographicalArea: 'Torino, Piedmont, Italy',
        coordinates: [Array],
        typeOfPoint: 'hikePoint'
      },
      {
        id: 2,
        name: 'Point of hike Rocciamelone',
        geographicalArea: 'Torino, Piedmont, Italy',
        coordinates: [Array],
        typeOfPoint: 'hikePoint'
      },
      {
        id: 4,
        name: 'Rocciamelone peak',
        geographicalArea: 'Torino, Piedmont, Italy',
        coordinates: [Array],
        typeOfPoint: 'referencePoint'
      }
    ],
    huts: [{id:3,name:"Rocciamelone",geographicalArea:'Torino,Piedmont,Italy',coordinates:[45.2033282666305,7.07699775695801],typeOfPoint:"hut"}],
    description: 'La montagna più alta di tutta la Val di Susa e una delle più importanti di tutto il Piemonte il cui indistinguibile profilo è ben visibile dalla pianura e sovrastra l’abitato di Susa con un dislivello dalla fondovalle alla cima di oltre 3000m in meno di 10km, caso unico in Europa. Noi affronteremo la salita dal Rifugio La Riposa, seguendo la via normale, un percorso per escursionisti esperti con un buon allenamento, che garantisce soddisfazioni uniche e visuali veramente superlative.',
    center: [ 45.1906585, 7.079086 ]
}
const ROCCIAMELONEHIKENOHUTS={
    id: 1,
    name: 'Rocciamelone',
    author: 'davidwallace@gmail.com',
    length: 4.56489292313034,
    expectedTime: 2.28244646156517,
    ascent: 1353.053467,
    difficulty: 'PROFESSIONAL HIKER',
    startPoint: {
      id: 1,
      name: 'Point of hike Rocciamelone',
      geographicalArea: 'Torino, Piedmont, Italy',
      coordinates: [ 45.177786, 7.083372 ],       
      typeOfPoint: 'hikePoint'
    },
    endPoint: {
      id: 2,
      name: 'Point of hike Rocciamelone',
      geographicalArea: 'Torino, Piedmont, Italy',
      coordinates: [ 45.203531, 7.07734 ],
      typeOfPoint: 'hikePoint'
    },
    referencePoints: [
      {
        id: 1,
        name: 'Point of hike Rocciamelone',
        geographicalArea: 'Torino, Piedmont, Italy',
        coordinates: [Array],
        typeOfPoint: 'hikePoint'
      },
      {
        id: 2,
        name: 'Point of hike Rocciamelone',
        geographicalArea: 'Torino, Piedmont, Italy',
        coordinates: [Array],
        typeOfPoint: 'hikePoint'
      },
      {
        id: 4,
        name: 'Rocciamelone peak',
        geographicalArea: 'Torino, Piedmont, Italy',
        coordinates: [Array],
        typeOfPoint: 'referencePoint'
      }
    ],
    huts: [],
    description: 'La montagna più alta di tutta la Val di Susa e una delle più importanti di tutto il Piemonte il cui indistinguibile profilo è ben visibile dalla pianura e sovrastra l’abitato di Susa con un dislivello dalla fondovalle alla cima di oltre 3000m in meno di 10km, caso unico in Europa. Noi affronteremo la salita dal Rifugio La Riposa, seguendo la via normale, un percorso per escursionisti esperti con un buon allenamento, che garantisce soddisfazioni uniche e visuali veramente superlative.',
    center: [ 45.1906585, 7.079086 ]
}

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
            expect(error.message).equal("Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees");
        }
    })

    test('get altitude invalid longitude',async()=>{
        try {
            await points.getAltitudePoint(INVALIDLNG.lat,INVALIDLNG.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDLNG.alt);
            expect(error.message).equal("Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees");
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
            expect(error.message).equal("Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees");
        }
    })

    test('get geographical area invalid longitude',async()=>{
        try {
            await points.getGeoAreaPoint(INVALIDLNG.lat,INVALIDLNG.lng,true);
        } catch (error) {
            expect(error.status).equal(INVALIDLNG.geopos);
            expect(error.message).equal("Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees");
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


describe('linkable huts',()=>{

    test('linkable huts to rocciamelone',async ()=>{
        const ret=await points.linkableHuts(ROCCIAMELONE.id,DAVIDWALLACE);
        expect(ret.length).equal(1);
        expect(ret[0].name).equal("Rocciamelone");
        expect(ret[0].id).equal(3);
        expect(ret[0].typeOfPoint).equal("hut");
    })

    test('linkable huts without being a local guide',async()=>{
        try {
            await points.linkableHuts(ROCCIAMELONE.id,JOEHIKER);
        } catch (error) {
            expect(error.status).equal(401);
            expect(error.message).equal("This type of user can't link huts to a hike");
        }
    })
})

describe('linkable starting/arrival points',()=>{
    test('linkable starting points to rocciamelone',async()=>{
        const ret=await points.linkableStartPoints(ROCCIAMELONE.id,DAVIDWALLACE);
        expect(ret.length).equal(1);
        expect(ret[0].name).equal("Rocciamelone");
    })

    test('linkable arrival points to rocciamelone',async()=>{
        const ret=await points.linkableStartPoints(ROCCIAMELONE.id,DAVIDWALLACE);
        expect(ret.length).equal(1);
        expect(ret[0].name).equal("Rocciamelone");
    })

    test('linkable starting points to rocciamelone without being a local guide',async()=>{
        try {
            await points.linkableStartPoints(ROCCIAMELONE.id,JOEHIKER);
        } catch (error) {
            expect(error.status).equal(401);
            expect(error.message).equal("This type of user can't link points to a hike");
        }
    })

    test('linkable arrival points to rocciamelone without being a local guide',async()=>{
        try {
            await points.linkableEndPoints(ROCCIAMELONE.id,JOEHIKER);
        } catch (error) {
            expect(error.status).equal(401);
            expect(error.message).equal("This type of user can't link points to a hike");
        }
    })
})

describe('link/unlink huts',()=>{

    test('link hut',async()=>{
        const body={hikeId:1,hutId:3}
        pointsdao.linkPointToHike=jest.fn();
        pointsdao.linkPointToHike.mockReturnValue();
        hikesdao.getHike=jest.fn();
        hikesdao.getHike.mockReturnValue(ROCCIAMELONEHIKENOHUTS);
        await points.linkHut(DAVIDWALLACE,body);
        expect(hikesdao.getHike.mock.calls[0][0]).equal(ROCCIAMELONEHIKENOHUTS.id);
        expect(pointsdao.linkPointToHike.mock.calls[0][0]).equal(body.hikeId);
        expect(pointsdao.linkPointToHike.mock.calls[0][1]).equal(body.hutId);
    })

    test('link an unlinkable hut to a hike',async()=>{
        try {
            const body={hikeId:1,hutId:68}
            pointsdao.linkPointToHike=jest.fn();
            pointsdao.linkPointToHike.mockReturnValue();
            await points.linkHut(DAVIDWALLACE,body);
        } catch (error) {
            expect(error.status).equal(422);
            expect(error.message).equal("This hut is not linkable to this hike");
        }
    })

    test('link an already linked hut to a hike',async()=>{
        try {
            const body={hikeId:1,hutId:3}
            pointsdao.linkPointToHike=jest.fn();
            pointsdao.linkPointToHike.mockReturnValue();
            await points.linkHut(DAVIDWALLACE,body);
        } catch (error) {
            expect(error.status).equal(422);
            expect(error.message).equal("This hut is already linked to this hike");
        }
    })

    test('unlink hut',async()=>{
        const body={hikeId:1,hutId:3}
        pointsdao.unlinkPointFromHike=jest.fn();
        pointsdao.unlinkPointFromHike.mockReturnValue();
        hikesdao.getHike=jest.fn();
        hikesdao.getHike.mockReturnValue(ROCCIAMELONE);
        await points.unlinkHut(DAVIDWALLACE,body);
        expect(pointsdao.linkPointToHike.mock.calls[0][0]).equal(body.hikeId);
        expect(pointsdao.linkPointToHike.mock.calls[0][1]).equal(body.hutId);
    })

    test('unlink a hut that is not linked to a hike',async()=>{
        try {
            const body={hikeId:1,hutId:68}
            pointsdao.unlinkPointFromHike=jest.fn();
            pointsdao.unlinkPointFromHike.mockReturnValue();
            await points.unlinkHut(DAVIDWALLACE,body);
        } catch (error) {
            expect(error.status).equal(422);
            expect(error.message).equal("This hut is not already linked to this hike");
        }
    })

    test('link a hut without being the author of the hike',async()=>{
        try {
            const body={hikeId:1,hutId:3}
            pointsdao.linkPointToHike=jest.fn();
            pointsdao.linkPointToHike.mockReturnValue();
            await points.linkHut(JOHNLAROCCIA,body);
        } catch (error) {
            expect(error.status).equal(401);
            expect(error.message).equal("This local guide doesn't have the rigths to update this hike");
        }
    })

    test('unlink a hut without being the author of the hike',async()=>{
        try {
            const body={hikeId:1,hutId:3}
            pointsdao.unlinkPointFromHike=jest.fn();
            pointsdao.unlinkPointFromHike.mockReturnValue();
            await points.linkHut(JOHNLAROCCIA,body);
        } catch (error) {
            expect(error.status).equal(401);
            expect(error.message).equal("This local guide doesn't have the rigths to update this hike");
        }
    })
})

describe('images for points',()=>{

    test('get images',async()=>{
        const ret=await points.getImages(3);
        expect(ret.length).equal(0);
    })

    test('get images with wrong params',async()=>{
        try {
            await points.getImages("bnfo");
        } catch (error) {
            expect(error.status).equal(422);
            expect(error.message).equal("Bad parameters");
        }
    })
})