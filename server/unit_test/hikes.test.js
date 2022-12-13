jest.mock('../dao/dao');

const hikes=require('../services/hikes');
const hikesdao=require('../dao/hikes');
const pointsdao=require('../dao/points');
const fs=require('fs');
const { expect } = require('chai');

const EARTHRADIUS=6371;
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
        const hikeslist=await hikesdao.getHikeMap(1);
        expect(hikeslist.coordinates.length>0).equal(true);
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