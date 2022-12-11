const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
var agent = chai.request.agent(app);


describe('filtering huts apis', () => {

    it('no filters',done=>{
        agent.post('/api/huts/list').then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(7);
            done();
        })
    })
    
    it('Rifugio filters',done=>{
        const filters={ name:"Rifugio", country:null,
         numberOfBedrooms:null, 
         coordinate:null, geographicalArea:null }
        agent.post('/api/huts/list').send(filters).then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(4);
            done();
        })
    })

    it('Add new hut',done=>{
        const hut={
                 name:"first hut",
                 country:"italy",
                 numberOfGuests:5,
                 numberOfBedrooms:4,
                 coordinate:"41.000144, 14.534893"
              }
        agent.post('/api/huts').send(hut).then(res=>{
            console.log("Res status",res.status);
            const filters={ name:"first hut", country:null,
          numberOfBedrooms:null, 
         coordinate:null, geographicalArea:null }
        agent.post('/api/huts/list').send(filters).then(res=>{
            console.log("Res.status",res.status);
            console.log("Res body len",res.body.length);
            res.should.have.status(200);
            expect(res.body.length).equal(1);
            done();
        })
        })
    })

});