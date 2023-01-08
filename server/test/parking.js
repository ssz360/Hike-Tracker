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
        agent.post('/api/login').send({username:"davidwallace@gmail.com",password:"123abcABC!"}).then(res=>{
            agent.get('/api/parkings').then(res=>{
                console.log('get status',res.status,'body',res.body);
                res.should.have.status(201);
                expect(res.body.length).equal(1);
                done();
            })
        });
    })
    
    it('new parking',done=>{
        const pk = {
             name:"Test parking",
            desc:"Test for parking it",
            coordinates:[ 45.27, 7.62 ],
            slots:4
           };
        agent.post('/api/login').send({username:"davidwallace@gmail.com",password:"123abcABC!"}).then(res=>{
            agent.post('/api/parking').send(pk).then(res=>{
                console.log('post status',res.status,'body',res.body);
                agent.get('/api/parkings').then(res=>{
                    console.log('get status',res.status,'body',res.body);
                    res.should.have.status(201);
                    expect(res.body.length).equal(2);
                    done();
                })
            })
        })
    })

});