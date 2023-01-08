const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs= require('fs');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
var agent = chai.request.agent(app);


describe('filtering huts apis', () => {

    it('no filters',done=>{
        agent.post('/api/huts/list').then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(1);
            done();
        })
    })
    
    it('Rocciamelone filters',done=>{
        const filters={ name:"Rocciamelone", country:null,
         numberOfBedrooms:null, 
         coordinate:null, geographicalArea:null }
        agent.post('/api/huts/list').send(filters).then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(1);
            done();
        })
    })

    it('Add new hut',done=>{
        const hut={
            name:"first hut",
            email:"testhut@gmail.com",
            description:"first test hut description",
            numberOfBedrooms:4,
            latitude:41.000144,
            longitude: 14.534893,
            phone:'3933009911',
            website:undefined
        }
        const imagehike=fs.readFileSync(`${__dirname}/../tmp/hike.jpg`);
        agent.post('/api/login').send({username:"davidwallace@gmail.com",password:"123abcABC!"}).then(res=>{
            agent.post('/api/huts').set('content-type', 'multipart/form-data')
                .field('name', hut.name)
                .field('description', hut.description)
                .field('email', hut.email)
                .field('numberOfBedrooms',hut.numberOfBedrooms)
                .field('latitude',hut.latitude)
                .field('longitude',hut.longitude)
                .field('phone',hut.phone)
                .attach('images', imagehike, 'tests/hike.jpg')
                .then(res=>{
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
    })

});