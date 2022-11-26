"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const DAOHikes = require("../dao/hikes");
const DAORefs = require("../dao/referencePoints");

const initQueries =
	"DELETE FROM REFERENCE_POINTS; DELETE FROM HUTS; DELETE FROM PARKINGS; DELETE FROM POINTS; DELETE FROM sqlite_sequence; INSERT INTO HUTS (IDPoint, Name, Country, NumberOfGuests, NumberOfBedRooms) VALUES    ( 2, 'Rifugio del Gufo', 'Italy', 20, 5),   ( 4, 'Rifugio Ciamarella', 'Italy', 30, 17),   ( 5, 'Rifugio Castaldi', 'Italy', 35, 7),   ( 7, 'Bivacco Gias Nuovo', 'Italy', 20, 10),   ( 9, 'Bivacco di Santa Cristina', 'Italy', 30, 17),   ( 10, 'Rifugio La Riposa', 'Italy', 30, 17),   ( 11, 'Casa Viù', 'Italy', 2, 5);  INSERT INTO PARKINGS (IDPoint, Name, Description, SlotsTot, SlotsFull)  VALUES    ( 1, 'Bardonecchia Park', 'Lorem ipsum', 60, 23),   ( 3, 'Posteggio Montuoso', 'Dolor sit amet', 20, 11),   ( 6, 'NewCarPark', 'Cras justo odio', 80, 59);  INSERT INTO POINTS(IDPoint, Name, Coordinates, GeographicalArea, TypeOfPoint)  VALUES    ( 1, 'Parcheggio Balme', '', 'Piedmont', 'Parking'),   ( 2, 'Rifugio del Gufo', '', 'Piedmont', 'Hut'),   ( 3, 'Parcheggio Graie', '', 'Piedmont', 'Parking'),   ( 4, 'Rifugio Ciamarella', '', 'Piedmont', 'Hut'),   ( 5, 'Rifugio Castaldi', '', 'Piedmont', 'Hut'),   ( 6, 'PArcheggio Forno Alpi', '', 'Piedmont', 'Parking'),   ( 7, 'Bivacco Gias Nuovo', '', 'Piedmont', 'Hut'),   ( 8, 'Parcheggio Cantoira', '', 'Piedmont', 'Parking'),   ( 9, 'Bivacco di Santa Cristina', '', 'Piedmont', 'Hut'),   ( 10, 'Rifugio La Riposa', '', 'Piedmont', 'Hut'),   ( 11, 'Casa Viù', '', 'Piedmont', 'Hut');";

async function testFactoryCreateLink(IDHike, IDPoint, valid, message) {
	return await DAOHikes.addReferenceToHike(IDHike, IDPoint).then(
		res => {
			// console.log(id);
			if (valid) return res === undefined;
		},
		err => {
			// console.log(err.message ?? err.toString());
			return err.message ? err.message.includes(message) : err.toString().includes(message);
		}
	);
}

async function testFactoryGetLinks(IDHike, IDPoint, valid, message) {
	return await DAORefs.getReferencesPoints(IDHike).then(
		rows => {
			// console.log(rows);
			if (valid) return rows.some(p => p.IDPoint === IDPoint);
			else return rows.length === 0;
		},
		err => {
			// console.log(err.message ?? err.toString());
			return err.message ? err.message.includes(message) : err.toString().includes(message);
		}
	);
}

describe("Unit Test: Reference Points", () => {
	describe("Link Huts to Hikes", () => {
		beforeEach(() => {
			db.serialize(() => {
				db.exec("PRAGMA foreign_keys = 'ON'");
				db.exec(initQueries);
			});
		});
		afterAll(() => {
			db.exec(initQueries);
		});
		test("Normal Call", async () => {
			expect(await testFactoryCreateLink(1, 2, true)).toBe(true);
			expect(await testFactoryGetLinks(1, 2, true)).toEqual(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testFactoryCreateLink(Number.MAX_VALUE, 2, false, "hike not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 2, false)).toEqual(true);
		});
		test("Non-existent Point", async () => {
			expect(await testFactoryCreateLink(1, Number.MAX_VALUE, false, "point not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 2, false)).toEqual(true);
		});
		test("Non-numerical Hike", async () => {
			expect(await testFactoryCreateLink("Number.MAX_VALUE", 2, false, "hike not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 2, false)).toEqual(true);
		});
		test("Non-numerical Point", async () => {
			expect(await testFactoryCreateLink(1, "Number.MAX_VALUE", false, "point not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 2, false)).toEqual(true);
		});
	});

	describe("Link Parkings to Hikes", () => {
		beforeEach(() => {
			db.serialize(() => {
				db.exec("PRAGMA foreign_keys = 'ON'");
				db.exec(initQueries);
			});
		});
		afterAll(() => {
			db.exec(initQueries);
		});
		test("Normal Call", async () => {
			expect(await testFactoryCreateLink(1, 3, true)).toBe(true);
			expect(await testFactoryGetLinks(1, 3, true)).toEqual(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testFactoryCreateLink(Number.MAX_VALUE, 3, false, "hike not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 3, false)).toEqual(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testFactoryCreateLink(1, Number.MAX_VALUE, false, "point not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 3, false)).toEqual(true);
		});
		test("Non-numerical Hike", async () => {
			expect(await testFactoryCreateLink("Number.MAX_VALUE", 3, false, "hike not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 3, false)).toEqual(true);
		});
		test("Non-numerical Point", async () => {
			expect(await testFactoryCreateLink(1, "Number.MAX_VALUE", false, "point not found")).toBe(true);
			expect(await testFactoryGetLinks(1, 3, false)).toEqual(true);
		});
	});
});
