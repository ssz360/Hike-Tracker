jest.mock('../dao/dao');

const hikes=require('../services/hikes');
const hikesdao=require('../dao/hikes');
const pointsdao=require('../dao/points');
const fs=require('fs');
const { expect } = require('chai');

const EARTHRADIUS=6371;
const IMAGES=[{filename:"1-2002-20.jpg",originalname:"beatiful_image_close_sun.jpg"},{filename:"1-2002-21.jpg",originalname:"ugly_image_close_sun.jpg"},{filename:"1-2002-22.jpg",originalname:"delightful_image_close_sun.jpg"}]
const DAVIDWALLACE={username:"davidwallace@gmail.com",type:"localGuide"};
const JOHNLAROCCIA={username:"johnlaroccia@gmail.com",type:"localGuide"};
const JOEHIKER={username:"joeloveshikes@gmail.com",type:"hiker"};
const POINTINSIDEROCCIAMELONE={name:"Rocciamelone awesome view of Mountain Chain",description:"Beautiful sight and a nice set of tables usable for picnics with family or friends",latitude:45.179219,longitude:7.082347};
const POINTOUTSIDEROCCIAMELONE={name:"Rocciamelone awesome view of Mountain Chain",description:"Beautiful sight and a nice set of tables usable for picnics with family or friends",latitude:44.179219,longitude:7.082347};
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
describe('hikes services',()=>{

    const readTestFile=async err=>{
        try {
            let file=null;
            if (err)    file=await fs.readFileSync(__dirname+'\\badtest.gpx');
            else    file=await fs.readFileSync(__dirname+'\\goodtest.gpx');
            return file;
        } catch (error) {
            throw error;
        }
    } 

    test('new hike',async()=>{
        hikesdao.newHike=jest.fn();
        hikesdao.newHike.mockReturnValue();
        pointsdao.insertPoint=jest.fn();
        pointsdao.insertPoint.mockReturnValue(9999);
        const file=await readTestFile(false);
        const body={name:"Roccia Del Malgioglio",description:"Testing hike",difficulty:"Hiker"}
        await hikes.newHike(body,{username:"davidwallace@gmail.com",type:"localGuide"},{buffer:Buffer.from(file)});
        expect(hikesdao.newHike.mock.calls[0][6]).equal("HIKER");
        expect(Math.ceil(hikesdao.newHike.mock.calls[0][2])).equal(1);
        expect(hikesdao.newHike.mock.calls[0][1]).equal("davidwallace@gmail.com");
        expect(hikesdao.newHike.mock.calls[0][7]).equal(9999);
        expect(hikesdao.newHike.mock.calls[0][8]).equal(9999);
        expect(pointsdao.insertPoint.mock.calls.length).equal(2);
        expect(pointsdao.insertPoint.mock.calls[0][0]).equal("Point of hike Roccia Del Malgioglio");
        expect(pointsdao.insertPoint.mock.calls[0][4].country).equal("Italy");
    })

    test('new hike fail',async()=>{
        try {
            hikesdao.newHike=jest.fn();
            hikesdao.newHike.mockReturnValue("");
            const file=await readTestFile(true);
            const body={name:"Roccia Del Malgioglio",description:"Testing hike",difficulty:"Hiker"}
            await hikes.newHike(body,{username:"davidwallace@gmail.com",type:"localGuide"},{buffer:Buffer.from(file)});
        } catch (error) {
            expect(error.status).equal(422);
        }
    })

    test('no auth',async()=>{
        try {
            hikesdao.newHike=jest.fn();
            hikesdao.newHike.mockReturnValue("");
            const file=await readTestFile(true);
            const body={name:"Roccia Del Malgioglio",description:"Testing hike",difficulty:"Hiker"}
            await hikes.newHike(body,{username:"jonhiker@gmail.com",type:"hiker"},{buffer:Buffer.from(file)});
        } catch (error) {
            expect(error.status).equal(401);
        }
    })

    test('hikes in bounds Rocciamelone',async()=>{
        const hikeslist=await hikes.hikesInBounds(POINTINSIDEROCCIAMELONE.latitude+0.01,POINTINSIDEROCCIAMELONE.longitude+0.01,POINTINSIDEROCCIAMELONE.latitude,POINTINSIDEROCCIAMELONE.longitude);
        expect(hikeslist.length).equal(1);
        expect(hikeslist[0].id).equal(ROCCIAMELONE.id);
        expect(hikeslist[0].center[0]).equal(ROCCIAMELONE.center[0]);
        expect(hikeslist[0].center[1]).equal(ROCCIAMELONE.center[1]);
    })

    test('no hikes in bounds',async()=>{
        const hikeslist=await hikes.hikesInBounds(POINTOUTSIDEROCCIAMELONE.latitude+0.01,POINTOUTSIDEROCCIAMELONE.longitude+0.01,POINTOUTSIDEROCCIAMELONE.latitude,POINTOUTSIDEROCCIAMELONE.longitude);
        expect(hikeslist.length).equal(0);
    })

})

describe('hikes dao',()=>{
    test('get hikes with filters',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(undefined,undefined,undefined,undefined,undefined,undefined,undefined,0,0,EARTHRADIUS);
        expect(hikeslist.length).equal(50);
    })
    

    test('get hikes with filters + difficulty',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(undefined,undefined,undefined,undefined,undefined,undefined,"HIKER",0,0,EARTHRADIUS);
        expect(hikeslist.length).equal(20);
    })


    test('get hikes map',async ()=>{
        const hikemap=await hikesdao.getHikeMap(1);
        expect(hikemap.coordinates.length>0).equal(true);
    })

    test('get map',async()=>{
        const hikemap=await hikes.getMap(1);
        expect(hikemap.coordinates.length>0).equal(true);
    })

    test('get map bad id',async()=>{
        try{
            await hikes.getMap("bui");
        }catch(error){
            expect(error.status).equal(422);
            expect(error.message).equal("Id should be an integer");
        }
    })

    test('get hikes at rocciamelone',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(undefined,undefined,undefined,undefined,undefined,undefined,undefined,45.1906585,7.079086,1);
        expect(hikeslist.length).equal(1);
    })

    test('get hikes at rocciamelone with more than 5kms',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(5,10,undefined,undefined,undefined,undefined,undefined,45.1906585,7.079086,1);
        expect(hikeslist.length).equal(0);
    })

})

describe('reference points',()=>{

    test('add reference point',async()=>{
        pointsdao.insertPoint=jest.fn();
        pointsdao.linkPointToHike=jest.fn();
        pointsdao.insertPoint.mockReturnValue(9999);
        pointsdao.linkPointToHike.mockReturnValue();
        await hikes.addReferencePoint(ROCCIAMELONE.id,[],POINTINSIDEROCCIAMELONE,DAVIDWALLACE);
        expect(pointsdao.insertPoint.mock.calls[0][0]).equal(POINTINSIDEROCCIAMELONE.name);
        expect(pointsdao.insertPoint.mock.calls[0][1]).equal(POINTINSIDEROCCIAMELONE.latitude);
        expect(pointsdao.insertPoint.mock.calls[0][2]).equal(POINTINSIDEROCCIAMELONE.longitude);
        expect(pointsdao.insertPoint.mock.calls[0][3]).equal(2168);
        expect(pointsdao.insertPoint.mock.calls[0][4].province).equal("Torino");
        expect(pointsdao.insertPoint.mock.calls[0][4].region).equal("Piedmont");
        expect(pointsdao.insertPoint.mock.calls[0][4].country).equal("Italy");
        expect(pointsdao.insertPoint.mock.calls[0][5]).equal("referencePoint");
        expect(pointsdao.insertPoint.mock.calls[0][6]).equal(POINTINSIDEROCCIAMELONE.description);
        expect(pointsdao.linkPointToHike.mock.calls[0][0]).equal(ROCCIAMELONE.id);
        expect(pointsdao.linkPointToHike.mock.calls[0][1]).equal(9999);  
    })

    test('add reference point that is not part of the hike',async()=>{
        try{
            pointsdao.insertPoint=jest.fn();
            pointsdao.linkPointToHike=jest.fn();
            pointsdao.insertPoint.mockReturnValue(9999);
            pointsdao.linkPointToHike.mockReturnValue();
            await hikes.addReferencePoint(ROCCIAMELONE.id,[],POINTOUTSIDEROCCIAMELONE,DAVIDWALLACE);
        }catch(error){
            expect(error.status).equal(422);
            expect(error.message).equal("These coordinates are not part of the hike track")
        }
    })

    test('add reference point with images',async()=>{
        pointsdao.insertPoint=jest.fn();
        pointsdao.linkPointToHike=jest.fn();
        pointsdao.insertPoint.mockReturnValue(9999);
        pointsdao.linkPointToHike.mockReturnValue();
        pointsdao.insertImageForPoint=jest.fn();
        pointsdao.insertImageForPoint.mockReturnValue();
        await hikes.addReferencePoint(ROCCIAMELONE.id,IMAGES,POINTINSIDEROCCIAMELONE,DAVIDWALLACE);
        expect(pointsdao.insertImageForPoint.mock.calls[0].length).equal(IMAGES.length-1);
        expect(pointsdao.insertImageForPoint.mock.calls[0][0]).equal(9999);
        expect(pointsdao.insertImageForPoint.mock.calls[0][1].filename).equal(IMAGES[0].filename);
    })

    test('add reference point without being author',async()=>{
        try{
            pointsdao.insertPoint=jest.fn();
            pointsdao.linkPointToHike=jest.fn();
            pointsdao.insertPoint.mockReturnValue(9999);
            pointsdao.linkPointToHike.mockReturnValue();
            await hikes.addReferencePoint(ROCCIAMELONE.id,[],POINTINSIDEROCCIAMELONE,JOHNLAROCCIA);
        }catch(error){
            expect(error.status).equal(401);
            expect(error.message).equal("This local guide doesn't have the rigths to update this hike reference points")
        }
    })

    test('add reference point without being a local guide',async()=>{
        try{
            pointsdao.insertPoint=jest.fn();
            pointsdao.linkPointToHike=jest.fn();
            pointsdao.insertPoint.mockReturnValue(9999);
            pointsdao.linkPointToHike.mockReturnValue();
            await hikes.addReferencePoint(ROCCIAMELONE.id,[],POINTINSIDEROCCIAMELONE,JOEHIKER);
        }catch(error){
            expect(error.status).equal(401);
            expect(error.message).equal("This type of user can't link points to a hike")
        }
    })

    test('add reference point with bad parameters',async()=>{
        try{
            pointsdao.insertPoint=jest.fn();
            pointsdao.linkPointToHike=jest.fn();
            pointsdao.insertPoint.mockReturnValue(9999);
            pointsdao.linkPointToHike.mockReturnValue();
            await hikes.addReferencePoint(ROCCIAMELONE.id,[],{name:undefined,description:undefined,latitude:"33a",longitude:"bifoi1"},DAVIDWALLACE);
        }catch(error){
            expect(error.status).equal(422);
            expect(error.message).equal("Bad parameters")
        }
    })
})