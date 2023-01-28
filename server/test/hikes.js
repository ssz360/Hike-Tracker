const { should, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs= require('fs');
const { afterEach, beforeEach, it } = require('mocha');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
var agent = chai.request.agent(app);

const getHikesFiltersQueryParams = (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, area) => {
    let queryParams = new URLSearchParams('?');
    if (lengthMin) queryParams.append('lenMin', lengthMin);
    if (lengthMax) queryParams.append('lenMax', lengthMax);
    if (expectedTimeMin) queryParams.append('expTimeMin', expectedTimeMin);
    if (expectedTimeMax) queryParams.append('expTimeMax', expectedTimeMax);
    if (ascentMin) queryParams.append('ascMin', ascentMin);
    if (ascentMax) queryParams.append('ascMax', ascentMax);
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (area) {
        queryParams.append('centerLat', area.center.lat);
        queryParams.append('centerLng', area.center.lng);
        queryParams.append('radius', area.radius);
    }
    return queryParams.toString();
}

describe('filtering hikes apis', () => {

    it('no filters',done=>{
        agent.get('/api/hikes').then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(50);
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
              radius: 1
            }
        }
        let queryParams=getHikesFiltersQueryParams(filters.lengthMin,filters.lengthMax,filters.expectedTimeMin,filters.expectedTimeMax,filters.ascentMin,
            filters.ascentMax,filters.difficulty,filters.area)
        agent.get('/api/hikes/filters' + (queryParams !== '' ? '?' + queryParams : '')).send(filters).then(res=>{
            res.should.have.status(200);
            expect(res.body.length).equal(1);
            done();
        })
    })

    it('new hike', done => {
        const imagehike=fs.readFileSync(`${__dirname}/../tmp/hike.jpg`);
        const imagehikelazio=fs.readFileSync(`${__dirname}/../tmp/hikelazio.jpg`);
        const hike=fs.readFileSync(`${__dirname}/Trekking_Vicino_Roma_Vitorchiano.gpx`);
        const filters={
            lengthMin: null,
            lengthMax: null,
            expectedTimeMin: null,
            expectedTimeMax: null,
            ascentMin: null,
            ascentMax: null,
            difficulty: null,
            area: {
              center: { lat:42.467837, lng: 12.171987},
              radius: 5
            }
        }
        agent.post('/api/login').send({username:"davidwallace@gmail.com",password:"123abcABC!"}).then(res=>{
            agent.post('/api/newHike')
                .set('content-type', 'multipart/form-data')
                .field('name', 'Vitorchiano')
                .field('description', 'Trekking track near Rome in Vitorchiano')
                .field('difficulty', 'PROFESSIONAL HIKER')
                .attach('images', imagehike, 'tests/hike.jpg')
                .attach('images', imagehikelazio, 'tests/hikelazio.jpg')
                .attach('file',hike,'test/Trekking_Vicino_Roma_Vitorchiano.gpx')
                .then(res=>{
                    expect(res.status).equal(201);
                    queryParams=getHikesFiltersQueryParams(filters.lengthMin,filters.lengthMax,filters.expectedTimeMin,filters.expectedTimeMax,filters.ascentMin,
                        filters.ascentMax,filters.difficulty,filters.area)
                    agent.get('/api/hikes/filters' + (queryParams !== '' ? '?' + queryParams : '')).send(filters).then(res=>{
                        //console.log('res status',res.status,'res body',res.body);
                        res.should.have.status(200);
                        expect(res.body.length).equal(1);
                        done();
                    })
            });
        });
        
    })

});