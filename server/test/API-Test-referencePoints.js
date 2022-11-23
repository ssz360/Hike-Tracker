"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { beforeEach } = require("mocha");
chai.use(chaiHttp);
chai.should();

const db = require("../dao/dao");
const app = require("../index");
const agent = chai.request.agent(app);

const refAPI = "/api/referencePoint";
const reqFactory = (IDHike, coordinates) => {
	return { IDHike, coordinates };
};

const testFactory = (name, IDHike, coordinates, status, returnValue) => {
	return it(name, done => {
		agent
			.post(refAPI)
			.send({ IDHike, coordinates })
			.then(res => {
				res.should.have.status(status);
				res.text.should.include(returnValue);
				done();
			})
			.catch(done);
	});
};

describe("API Test: Reference Points", () => {
	describe("POST addReferencePoint", () => {
		beforeEach(() => {
			db.exec(
				'PRAGMA foreign_keys = "1"; DROP TABLE IF EXISTS "REFERENCE_POINTS"; CREATE TABLE IF NOT EXISTS "REFERENCE_POINTS"("IDPoint" INTEGER NOT NULL, "IDHike"	INTEGER NOT NULL, FOREIGN KEY("IDHike") REFERENCES "HIKES"("IDHike"), FOREIGN KEY("IDPoint") REFERENCES "POINTS"("IDPoint"));'
			);
			// agent.post("/api/login").send({ username: "dragonzhao1992@gmail.com", password: "Zazaza1234!" });
			// it("User Login", done => {
			// 	agent
			// 		.post("/api/login")
			// 		.send({ username: "dragonzhao1992@gmail.com", password: "Zazaza1234!" })
			// 		.then(res => {
			// 			res.should.have.status(500);
			// 			done();
			// 		})
			// 		.catch(done);
			// });
		});
		afterEach(() => {
			db.exec(
				'DELETE FROM REFERENCE_POINTS; DELETE FROM POINTS WHERE TypeOfPoint = "Reference"; DELETE FROM sqlite_sequence WHERE name = "POINTS"'
			);
		});

		testFactory("Normal Call", 1, "1,1", "200", "1");
		testFactory("Non-existent IDHike", Number.MAX_VALUE, "1,1", "404", "Hike");
		testFactory("Invalid Coordinates ", 1, "Not Coordinates", "400", "Coordinates");
		// testFactory("Normal Call", 1, [1, 1], 200, 1);
		// testFactory("Normal Call", 1, [1, 1], 200, 1);
	});
});
