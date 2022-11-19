jest.mock('../dao/dao');

const hikes=require('../services/hikes');
const hikesdao=require('../dao/hikes');
const usersdao=require('../dao/users');
const fs=require('fs');
const { expect } = require('chai');
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
        usersdao.getUserType=jest.fn();
        hikesdao.newHike.mockReturnValue("");
        usersdao.getUserType.mockReturnValue("Local Guide");
        const file=await readTestFile(false);
        await hikes.newHike("Roccia Del Malgioglio",{username:"jonlocalguide@gmail.com",type:"localGuide"},"Testing hike","Hiker",file);
        expect(hikesdao.newHike.mock.calls[0][5]).equal("HIKER");
        expect(Math.ceil(hikesdao.newHike.mock.calls[0][2])).equal(67);
        expect(JSON.parse(hikesdao.newHike.mock.calls[0][9]).length).equal(4);
    })

    test('new hike fail',async()=>{
        try {
            hikesdao.newHike=jest.fn();
            usersdao.getUserType=jest.fn();
            hikesdao.newHike.mockReturnValue("");
            usersdao.getUserType.mockReturnValue("Local Guide");
            const file=await readTestFile(true);
            await hikes.newHike("Roccia Del Malgioglio",{username:"jonlocalguide@gmail.com",type:"localGuide"},"Testing hike","Hiker",file);
        } catch (error) {
            expect(error.status).equal(244);
        }
    })

    test('no auth',async()=>{
        try {
            hikesdao.newHike=jest.fn();
            usersdao.getUserType=jest.fn();
            hikesdao.newHike.mockReturnValue("");
            usersdao.getUserType.mockReturnValue("Local Guide");
            const file=await readTestFile(true);
            await hikes.newHike("Roccia Del Malgioglio",{username:"jonhiker@gmail.com",type:"hiker"},"Testing hike","Hiker",file);
        } catch (error) {
            expect(error.status).equal(401);
        }
    })

})

describe('hikes dao',()=>{

    test('get hikes with filters',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(false,undefined,undefined,undefined,undefined,undefined,undefined,undefined,0,0,90,180);
        expect(hikeslist.length).equal(6);
    })

    test('get hikes with map',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(true,undefined,undefined,undefined,undefined,undefined,undefined,undefined,0,0,90,180);
        expect(hikeslist[0].coordinates.length>0).equal(true);
    })

    test('get hikes at rocciamelone',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(false,undefined,undefined,undefined,undefined,undefined,undefined,undefined,45.1906585, 7.079086,0.001,0.001);
        expect(hikeslist.length).equal(3);
    })

    test('get hikes at rocciamelone with more than 5kms',async ()=>{
        const hikeslist=await hikesdao.getHikesListWithFilters(false,5,10,undefined,undefined,undefined,undefined,undefined,45.1906585, 7.079086,0.001,0.001);
        expect(hikeslist.length).equal(1);
    })

})