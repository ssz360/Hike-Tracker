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
//const initQueries =
//	"DELETE FROM REFERENCE_POINTS; DELETE FROM HUTS; DELETE FROM PARKINGS; DELETE FROM POINTS; DELETE FROM sqlite_sequence; INSERT INTO HUTS (IDPoint, Name, Country, NumberOfGuests, NumberOfBedRooms) VALUES    ( 2, 'Rifugio del Gufo', 'Italy', 20, 5),   ( 4, 'Rifugio Ciamarella', 'Italy', 30, 17),   ( 5, 'Rifugio Castaldi', 'Italy', 35, 7),   ( 7, 'Bivacco Gias Nuovo', 'Italy', 20, 10),   ( 9, 'Bivacco di Santa Cristina', 'Italy', 30, 17),   ( 10, 'Rifugio La Riposa', 'Italy', 30, 17),   ( 11, 'Casa Viù', 'Italy', 2, 5);  INSERT INTO PARKINGS (IDPoint, Name, Description, SlotsTot, SlotsFull)  VALUES    ( 1, 'Bardonecchia Park', 'Lorem ipsum', 60, 23),   ( 3, 'Posteggio Montuoso', 'Dolor sit amet', 20, 11),   ( 6, 'NewCarPark', 'Cras justo odio', 80, 59);  INSERT INTO POINTS(IDPoint, Name, Coordinates, GeographicalArea, TypeOfPoint)  VALUES    ( 1, 'Parcheggio Balme', '', 'Piedmont', 'Parking'),   ( 2, 'Rifugio del Gufo', '', 'Piedmont', 'Hut'),   ( 3, 'Parcheggio Graie', '', 'Piedmont', 'Parking'),   ( 4, 'Rifugio Ciamarella', '', 'Piedmont', 'Hut'),   ( 5, 'Rifugio Castaldi', '', 'Piedmont', 'Hut'),   ( 6, 'PArcheggio Forno Alpi', '', 'Piedmont', 'Parking'),   ( 7, 'Bivacco Gias Nuovo', '', 'Piedmont', 'Hut'),   ( 8, 'Parcheggio Cantoira', '', 'Piedmont', 'Parking'),   ( 9, 'Bivacco di Santa Cristina', '', 'Piedmont', 'Hut'),   ( 10, 'Rifugio La Riposa', '', 'Piedmont', 'Hut'),   ( 11, 'Casa Viù', '', 'Piedmont', 'Hut');";

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
		/*beforeEach(() => {
			db.serialize(() => {
				db.exec("PRAGMA foreign_keys = 'ON'");
				db.exec(initQueries);
			});
		});
		after(() => {
			db.exec(initQueries);
		});*/
		testFactory("Normal Call", 1, '1,1', 200, "1");
		testFactory("Non-existent IDHike", Number.MAX_VALUE, "1,1", 404, "Hike");
		testFactory("Invalid Coordinates ", 1, "Not Coordinates", 400, "Coordinates");
		// testFactory("Normal Call", 1, [1, 1], 200, 1);
		// testFactory("Normal Call", 1, [1, 1], 200, 1);
	});
});
