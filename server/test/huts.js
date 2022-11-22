const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
var agent = chai.request.agent(app);

/*
describe('filtering huts apis', () => {

    it('no filters',done=>{
        agent.post('/api/huts/list').then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(6);
            done();
        })
    })
    
    it('rocciamelone filters',done=>{
        const filters={
            lengthMin: null,
            lengthMax: null,
            expectedTimeMin: null,
            expectedTimeMax: null,
            ascentMin: null,
            ascentMax: null,
            difficulty: null,
            area: {
              center: { lat: 45.1906585, lng: 7.079086 },
              radius: 100.00
            }
        }
        agent.post('/api/hikes').send(filters).then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(3);
            done();
        })
    })

});
*/