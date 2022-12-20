"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { beforeEach } = require("mocha");
chai.use(chaiHttp);
chai.should();

const db = require("../dao/dao");
const app = require("../index");
const agent = chai.request.agent(app);

const APIAddTrip = "/api/trips";
const APIGetTrip = "/api/trips/id/";
const APILogin = "/api/login";
const credentials = { username: "davidwallace@gmail.com", password: "123abcABC!" };

const initQueries = "PRAGMA foreign_keys = '1'; DELETE FROM TRIPS; DELETE FROM sqlite_sequence WHERE name='TRIPS';";

const testFactoryAddTrip = (name, trip, success, expectedStatus, expectedBody) => {
	return it(name, done => {
		agent
			.post(APILogin)
			.send(credentials)
			.then(() => {
				agent
					.post(APIAddTrip)
					.send(trip)
					.then(res => {
						// console.log(res.text);
						res.should.have.status(expectedStatus);
						success ? res.body.should.deep.equal(1) : res.text.should.include(expectedBody);
                        done();
						if (success)
							agent.get(APIGetTrip + res.body).then(res => {
								// console.log(res.body);
								res.should.have.status(200);
								res.body.should.deep.equal(expectedBody);
								done();
							});
					})
					.catch(done);
			})
			.catch(done);
	});
};

const tripFactory = ({ params }) => {
	return {
		IDHike: params.IDTrip ?? 1,
		ID_start_point: params.ID_start_point ?? 1,
		start_time: params.start_time ?? "2019-01-01 00:00:00"
	};
};

describe("addTrips", () => {
	beforeEach(() => {
		db.exec(initQueries, err => {
			if (err) console.log(err);
		});
	});
	testFactoryAddTrip("Normal Call", tripFactory({ params: {} }), true, 201, {
		IDTrip: 1,
		IDHike: 1,
		IDUser: "davidwallace@gmail.com",
		start_time: "2019-01-01 00:00:00",
		end_time: null,
		ID_last_ref: 1,
		status: "Ongoing"
	});
	testFactoryAddTrip(
		"Invalid ID_start_point",
		tripFactory({ params: { ID_start_point: Number.MAX_VALUE } }),
		false,
		500,
		"FOREIGN KEY constraint failed"
	);
	testFactoryAddTrip(
		"Invalid start_time",
		tripFactory({ params: { start_time: "Not a Time" } }),
		false,
		500,
		"NOT NULL constraint failed"
	);
});
