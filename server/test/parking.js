const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
var agent = chai.request.agent(app);


describe('filtering huts apis', () => {

    it('get parking list',done=>{
        agent.get('/api/parkings').then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(4);
            done();
        })
    })
    
    it('new parking',done=>{
        const pk = {
             name:"Test parking",
            desc:"Test for parking it",
            coordinates:[1,1],
            geographicalArea:"Italy",
            slots:4
           };
        agent.post('/api/parking').send(pk).then(res=>{
            agent.get('/api/parkings').then(res=>{
                res.should.have.status(200);
                expect(res.body.length).equal(5);
                done();
            })
        })
    })

});