"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { beforeEach } = require("mocha");
chai.use(chaiHttp);
chai.should();

const db = require("../dao/__mocks__/dao");
const app = require("../index");
const agent = chai.request.agent(app);

const APIAddRef = "/api/addReferenceToHike";
const APIUpdateStartEnd = "/api/updateStartEndPoint";
const initQueries =
	"DELETE FROM REFERENCE_POINTS; DELETE FROM HUTS; DELETE FROM PARKINGS; DELETE FROM POINTS; DELETE FROM sqlite_sequence; INSERT INTO HUTS (IDPoint, Name, Country, NumberOfGuests, NumberOfBedRooms) VALUES    ( 2, 'Rifugio del Gufo', 'Italy', 20, 5),   ( 4, 'Rifugio Ciamarella', 'Italy', 30, 17),   ( 5, 'Rifugio Castaldi', 'Italy', 35, 7),   ( 7, 'Bivacco Gias Nuovo', 'Italy', 20, 10),   ( 9, 'Bivacco di Santa Cristina', 'Italy', 30, 17),   ( 10, 'Rifugio La Riposa', 'Italy', 30, 17),   ( 11, 'Casa Viù', 'Italy', 2, 5);  INSERT INTO PARKINGS (IDPoint, Name, Description, SlotsTot, SlotsFull)  VALUES    ( 1, 'Bardonecchia Park', 'Lorem ipsum', 60, 23),   ( 3, 'Posteggio Montuoso', 'Dolor sit amet', 20, 11),   ( 6, 'NewCarPark', 'Cras justo odio', 80, 59);  INSERT INTO POINTS(IDPoint, Name, Coordinates, GeographicalArea, TypeOfPoint)  VALUES    ( 1, 'Parcheggio Balme', '', 'Piedmont', 'Parking'),   ( 2, 'Rifugio del Gufo', '', 'Piedmont', 'Hut'),   ( 3, 'Parcheggio Graie', '', 'Piedmont', 'Parking'),   ( 4, 'Rifugio Ciamarella', '', 'Piedmont', 'Hut'),   ( 5, 'Rifugio Castaldi', '', 'Piedmont', 'Hut'),   ( 6, 'PArcheggio Forno Alpi', '', 'Piedmont', 'Parking'),   ( 7, 'Bivacco Gias Nuovo', '', 'Piedmont', 'Hut'),   ( 8, 'Parcheggio Cantoira', '', 'Piedmont', 'Parking'),   ( 9, 'Bivacco di Santa Cristina', '', 'Piedmont', 'Hut'),   ( 10, 'Rifugio La Riposa', '', 'Piedmont', 'Hut'),   ( 11, 'Casa Viù', '', 'Piedmont', 'Hut');";

const testFactoryAddRef = (name, IDHike, IDPoint, status, message) => {
	return it(name, done => {
		agent
			.post(APIAddRef)
			.send({ IDHike, IDPoint })
			.then(res => {
				// console.log(res.body);
				res.should.have.status(status);
				res.text.should.include(message);
				done();
			})
			.catch(done);
	});
};

const testFactoryUpdStrEnd = (name, IDHike, StartPoint, EndPoint, status, message) => {
	return it(name, done => {
		agent
			.post(APIUpdateStartEnd)
			.send({ IDHike, StartPoint, EndPoint })
			.then(res => {
				res.should.have.status(status);
				res.text.should.include(message);
				done();
			})
			.catch(done);
	});
};

describe("API Test: Link Points To Hikes", () => {
	beforeEach(() => {
		db.serialize(() => {
			db.exec("PRAGMA foreign_keys = 'ON'");
			db.exec(initQueries);
		});
	});
	after(() => {
		db.exec(initQueries);
	});
	describe("Link huts to hikes", () => {
		testFactoryAddRef("Normal Call", 1, 2, "201", "");
		testFactoryAddRef("Non-existent Hikes", Number.MAX_VALUE, 2, "404", "hike not found");
		testFactoryAddRef("Non-existent Point", 2, Number.MAX_VALUE, "404", "point not found");
		testFactoryAddRef("Non-numerical Hikes", "Number.MAX_VALUE", 2, "404", "hike not found");
		testFactoryAddRef("Non-numerical Point", 2, "Number.MAX_VALUE", "404", "point not found");
	});

	describe("Link parkings to hikes", () => {
		testFactoryAddRef("Normal Call", 1, 3, "201", "");
		testFactoryAddRef("Non-existent Hikes", Number.MAX_VALUE, 3, "404", "hike not found");
		testFactoryAddRef("Non-existent Point", 1, Number.MAX_VALUE, "404", "point not found");
		testFactoryAddRef("Non-numerical Hikes", "Number.MAX_VALUE", 3, "404", "hike not found");
		testFactoryAddRef("Non-numerical Point", 1, "Number.MAX_VALUE", "404", "point not found");
	});
});

describe("API Test: Update Start/End Points", () => {
	describe("Update Start Points", () => {
		testFactoryUpdStrEnd("Normal Call", 1, 1, undefined, "201", "");
		// testFactoryUpdStrEnd("Non-existent Hikes", Number.MAX_VALUE, 1, undefined, "404", "Hike");
		testFactoryUpdStrEnd("Non-existent Start Point", 1, Number.MAX_VALUE, undefined, "404", "Start point");
		// testFactoryUpdStrEnd("Non-numerical Hikes", "Number.MAX_VALUE", 1, undefined, "404", "Hike");
		testFactoryUpdStrEnd("Non-numerical Start Point", 2, "Number.MAX_VALUE", undefined, "404", "Start point");
	});
	describe("Update End Points", () => {
		testFactoryUpdStrEnd("Normal Call", 1, undefined, 1, "201", "");
		// testFactoryUpdStrEnd("Non-existent Hikes", Number.MAX_VALUE, undefined, 1, "404", "Hike");
		testFactoryUpdStrEnd("Non-existent End Point", 1, undefined, Number.MAX_VALUE, "404", "End point");
		// testFactoryUpdStrEnd("Non-numerical Hikes", "Number.MAX_VALUE", undefined, 1, "404", "Hike");
		testFactoryUpdStrEnd("Non-numerical End Point", 2, undefined, "Number.MAX_VALUE", "404", "End point");
	});
	describe("Update Start & End Points", () => {
		testFactoryUpdStrEnd("Normal Call", 1, 1, 2, "201", "");
		// testFactoryUpdStrEnd("Non-existent Hikes", Number.MAX_VALUE, 1, 2, "404", "Hike");
		testFactoryUpdStrEnd("Undefined Points", 1, undefined, undefined, "500", "startPoint or endPoint");
		testFactoryUpdStrEnd("Non-existent Points", 1, Number.MAX_VALUE, Number.MAX_VALUE, "404", "Start point");
		// testFactoryUpdStrEnd("Non-numerical Hikes", "Number.MAX_VALUE", undefined, 1, 2, "404", "Hike");
		testFactoryUpdStrEnd("Non-numerical Points", 2, "Number.MAX_VALUE", "Number.MAX_VALUE", "404", "Start point");
	});
});
