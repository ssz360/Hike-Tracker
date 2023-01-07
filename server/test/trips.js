"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { after } = require("mocha");
chai.use(chaiHttp);
chai.should();

const db = require("../dao/dao");
const app = require("../index");
const agent = chai.request.agent(app);

const APIAddTrip = "/api/trip";
const APIGetTrip = "/api/trips/tripId/:idTrip";
const APIPauseTrip = "/api/trip/pause";
const APIResumeTrip = "/api/trip/resume";
const APILogin = "/api/login";
const credentials = {
	username: "davidwallace@gmail.com",
	password: "123abcABC!"
};

const initQueries =
	"PRAGMA foreign_keys = '1'; DELETE FROM trips WHERE IDUser = 'davidwallace@gmail.com'; DELETE FROM sqlite_sequence WHERE name='TRIPS';";

const callLogin = () => {
	return agent.post(APILogin).send(credentials);
};

const callAddTrip = (success, expectedStatus, expectedBody) => {
	return res => {
		// console.log(res.text);
		res.should.have.status(expectedStatus);
		success
			? res.body.should.deep.equal(1)
			: res.text.should.include(expectedBody);
		if (success)
			agent.get(APIGetTrip + res.body).then(res => {
				// console.log(res.body);
				res.should.have.status(200);
				res.body.should.deep.equal(expectedBody);
			});
	};
};

const callPauseResumeTrip = (
	success,
	expectedStatus,
	expectedBody,
	isPausing
) => {
	return res => {
		// console.log(res.text);
		res.should.have.status(expectedStatus);
		success
			? res.body.should.deep.equal(1)
			: res.text.should.include(expectedBody);
		if (success)
			agent.get(APIGetTrip + expectedBody.IDTrip).then(res => {
				// console.log(res.body);
				res.should.have.status(200);
				res.body.status.should.deep.equal(
					isPausing ? "Paused" : "Ongoing"
				);
			});
	};
};

const testAddTrip = (name, trip, success, expectedStatus, expectedBody) => {
	return it(name, done => {
		callLogin()
			.then(() => {
				agent
					.post(APIAddTrip)
					.send(trip)
					.then(callAddTrip(success, expectedStatus, expectedBody));
				done();
			})
			.catch(done);
	});
};

const testPauseTrip = (
	name,
	trip,
	reqBody,
	success,
	expectedStatus,
	expectedBody
) => {
	return it(name, done => {
		callLogin()
			.then(() => {
				agent
					.post(APIAddTrip)
					.send(trip)
					.then(callAddTrip(success, expectedStatus, expectedBody));
				agent
					.put(APIPauseTrip)
					.send(reqBody)
					.then(
						callPauseResumeTrip(
							success,
							expectedStatus,
							expectedBody,
							true
						)
					);
				done();
			})
			.catch(done);
	});
};

const testResumeTrip = (
	name,
	trip,
	reqBody,
	success,
	expectedStatus,
	expectedBody
) => {
	return it(name, done => {
		callLogin()
			.then(() => {
				agent
					.post(APIAddTrip)
					.send(trip)
					.then(callAddTrip(success, expectedStatus, expectedBody));
				agent
					.put(APIPauseTrip)
					.send(reqBody)
					.then(
						callPauseResumeTrip(
							success,
							expectedStatus,
							expectedBody,
							true
						)
					);
				agent
					.put(APIResumeTrip)
					.send(reqBody)
					.then(
						callPauseResumeTrip(
							success,
							expectedStatus,
							expectedBody,
							false
						)
					);
				done();
			})
			.catch(done);
	});
};

const trip = params => {
	return {
		IDHike: params.IDHike ?? 1,
		startTime: params.startTime ?? "2019-01-01 00:00:00"
	};
};

const reqBodyPauseResume = params => {
	return {
		stoppedAt: params.stoppedAt ?? "2019-01-01 12:00:00",
		secsFromLastStop: params.secsFromLastStop ?? 100
	};
};

describe("addTrips", () => {
	after(async () => {
		db.exec(initQueries, err => {
			if (err) err.message ? console.log(err.message) : console.log(err);
		});
	});
	testAddTrip("Normal Call", trip({}), true, 200, {
		IDTrip: 1,
		IDHike: 1,
		IDUser: "davidwallace@gmail.com",
		startTime: "2019-01-01 00:00:00",
		end_time: null,
		ID_last_ref: 1,
		status: "Ongoing"
	});
	testAddTrip(
		"Invalid start_time",
		trip({ startTime: "Not a Time" }),
		false,
		400,
		"Invalid date"
	);
});

describe("pauseTrips", () => {
	after(async () => {
		db.exec(initQueries, err => {
			if (err) err.message ? console.log(err.message) : console.log(err);
		});
	});
	testPauseTrip("Normal Call", trip({}), reqBodyPauseResume({}), true, 200, {
		IDTrip: 1
	});
	testPauseTrip(
		"Invalid Stop Time",
		trip({}),
		reqBodyPauseResume({ stoppedAt: "Not a Time" }),
		false,
		400,
		"Invalid date"
	);
});

describe("resumeTrips", () => {
	after(async () => {
		db.exec(initQueries, err => {
			if (err) err.message ? console.log(err.message) : console.log(err);
		});
	});
	testResumeTrip("Normal Call", trip({}), reqBodyPauseResume({}), true, 200, {
		IDTrip: 1
	});
	testResumeTrip(
		"Invalid date",
		trip({}),
		reqBodyPauseResume({ stoppedAt: "Not a Time" }),
		false,
		400,
		"Invalid date"
	);
});
