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
        await hikes.newHike("Roccia Del Malgioglio","jonlocalguide@gmail.com","Testing hike","Hiker",file);
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
            await hikes.newHike("Roccia Del Malgioglio","jonlocalguide@gmail.com","Testing hike","Hiker",file);
        } catch (error) {
            expect(error.status).equal(244);
        }
    })

})