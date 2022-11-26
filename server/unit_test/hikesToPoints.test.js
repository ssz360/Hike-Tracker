"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const DAOHikes = require("../dao/hikes");
const DAORefs = require("../dao/referencePoints");
const DAOPoints = require("../dao/points");

const initQueries =
	"DELETE FROM REFERENCE_POINTS; DELETE FROM HUTS; DELETE FROM PARKINGS; DELETE FROM POINTS; DELETE FROM HIKES; DELETE FROM sqlite_sequence; INSERT INTO HUTS (IDPoint, Name, Country, NumberOfGuests, NumberOfBedRooms) VALUES ( 2, 'Rifugio del Gufo', 'Italy', 20, 5), ( 4, 'Rifugio Ciamarella', 'Italy', 30, 17), ( 5, 'Rifugio Castaldi', 'Italy', 35, 7), ( 7, 'Bivacco Gias Nuovo', 'Italy', 20, 10), ( 9, 'Bivacco di Santa Cristina', 'Italy', 30, 17), ( 10, 'Rifugio La Riposa', 'Italy', 30, 17), ( 11, 'Casa Viù', 'Italy', 2, 5); INSERT INTO PARKINGS (IDPoint, Name, Description, SlotsTot, SlotsFull) VALUES ( 1, 'Bardonecchia Park', 'Lorem ipsum', 60, 23), ( 3, 'Posteggio Montuoso', 'Dolor sit amet', 20, 11), ( 6, 'NewCarPark', 'Cras justo odio', 80, 59); INSERT INTO POINTS(IDPoint, Name, Coordinates, GeographicalArea, TypeOfPoint) VALUES ( 1, 'Parcheggio Balme', '', 'Piedmont', 'Parking'), ( 2, 'Rifugio del Gufo', '', 'Piedmont', 'Hut'), ( 3, 'Parcheggio Graie', '', 'Piedmont', 'Parking'), ( 4, 'Rifugio Ciamarella', '', 'Piedmont', 'Hut'), ( 5, 'Rifugio Castaldi', '', 'Piedmont', 'Hut'), ( 6, 'PArcheggio Forno Alpi', '', 'Piedmont', 'Parking'), ( 7, 'Bivacco Gias Nuovo', '', 'Piedmont', 'Hut'), ( 8, 'Parcheggio Cantoira', '', 'Piedmont', 'Parking'), ( 9, 'Bivacco di Santa Cristina', '', 'Piedmont', 'Hut'), ( 10, 'Rifugio La Riposa', '', 'Piedmont', 'Hut'), ( 11, 'Casa Viù', '', 'Piedmont', 'Hut');INSERT INTO HIKES (Name , Author, Length, ExpectedTime, Ascent, Difficulty, StartPoint, EndPoint, CenterLat, CenterLon, ReferencePoints, Description) VALUES ( 'Lago di Afframont', 's292671@studenti.polito.it', 3, 7.5, 400, 'TOURIST', 'Parcheggio Balme', 'Rifugio del Gufo', 44.601004142314196, 7.139863958582282, NULL, 'Here the reflections of the snow-capped mountains and the larch trees in autumnal garments create a truly unique setting. The excursion takes place on a path, initially inside a dense forest while, in the last part, wide plateaus and old pastures follow one another. The lake is set in a basin with a particular and suggestive setting'), ('Rifugio Gastaldi', 'jonhutworker@gmail.com', 4, 13, 550, 'HIKER', 'Parcheggio Graie', 'Rifugio Ciamarella', 45.1906585, 7.079086, NULL, 'Ciamarella (3767 m), the highest of the Lanzo Valleys. There is also a beautiful view towards the Crot del Ciaussinè basin , with its lakes, and the surrounding peaks.'), ('Rifugio Gastaldi', 'jonhutworker@gmail.com', 4, 7, 550, 'HIKER', 'Parcheggio Graie', 'Rifugio Gastaldi', 44.601004142314196, 7.139863958582282, NULL, 'Ciamarella (3767 m), the highest of the Lanzo Valleys. There is also a beautiful view towards the Crot del Ciaussinè basin , with its lakes, and the surrounding peaks.'), ('Bivacco Gias Nuovo', 's292671@studenti.polito.it', 8.5, 2.45, 450, 'PROFESSIONAL HIKER', 'Parcheggio Forno Alpi', 'Bivacco Gias Nuovo', 45.1906585, 7.079086, NULL, 'The Gias Nuovo Bivouac is located in the Vallone Di Sea, in the Val Grande , in Forno Alpi Graie at an altitude of 1893 m. The excursion develops entirely on a path that climbs quite steep at times. The bivouac is located at the end of the vast and wide plateau of Gias Nuovo. It is a bivouac built in 2019 entirely of wood and with a very particular shape.'), ('Santa Cristina', 'jonhutworker@gmail.com', 13.5, 1.30, 7500, 'PROFESSIONAL HIKER', 'Parcheggio Cantoira', 'Bivacco di Santa Cristina', 44.601004142314196, 7.139863958582282, NULL, 'The Sanctuary of Santa Cristina is located on a rocky spur overlooking the entrance to two valleys: Val Grande and Val d Ala. It is located at an altitude of 1340 m. The Sanctuary stands out above a staircase and its position allows you to admire the main peaks of the Lanzo Valleys.'), ('Rocciamelone', 's292671@studenti.polito.it', 3, 2.30, 1650, 'HIKER', 'Rifugio La Riposa', 'Casa Viù', 45.1906585, 7.079086, NULL, 'The climb to Rocciamelone is a great classic of excursions in Piedmont and in the Val di Susa in particular. It is in fact a very coveted peak frequented by Piedmontese hikers and beyond. It is located at an altitude of 3538 m and on its top there is the highest sanctuary in Europe , a bronze statue of the Madonna and the Bivouac Rifugio Santa Maria. Rocciamelone is a mountain that divides the Val di Susa from the Val di Viù . In fact, the territories of Mompantero, Novalesa and Usseglio converge on the summit. From the top the view sweeps over Monviso , Mont Blanc , Gran Paradiso , Monte Rosa and the Turin hills. A view to take your breath away.');";

async function testCreateLink(IDHike, IDPoint, valid, message) {
	return await DAOHikes.addReferenceToHike(IDHike, IDPoint).then(
		res => {
			// console.log(res);
			if (valid) return res === undefined;
		},
		err => {
			// console.log(err.message ?? err.toString());
			return err.message ? err.message.includes(message) : err.toString().includes(message);
		}
	);
}

async function testUpdateStartEnd(IDHike, IDStartPoint, IDEndPoint, valid, message) {
	return await DAOHikes.updateStartingArrivalPoint(IDHike, IDStartPoint, IDEndPoint).then(
		res => {
			// console.log(res);
			if (valid) return res === undefined;
		},
		err => {
			// console.log(err.message ?? err.toString());
			return err.message ? err.message.includes(message) : err.toString().includes(message);
		}
	);
}

async function testGetLinks(IDHike, IDPoint, valid, message) {
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

async function testGetHikes(IDHike, IDPoint, isStartPoint, valid, message) {
	return await DAOHikes.getHikesList().then(
		rows => {
			return (
				valid ===
				rows
					.filter(h => h.IDHike === IDHike)
					.some(p => {
						return isStartPoint
							? Number.parseInt(p.StartPoint) === IDPoint
							: Number.parseInt(p.EndPoint) === IDPoint;
					})
			);
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
			expect(await testCreateLink(1, 2, true)).toBe(true);
			expect(await testGetLinks(1, 2, true)).toBe(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testCreateLink(Number.MAX_VALUE, 2, false, "hike not found")).toBe(true);
			expect(await testGetLinks(1, 2, false)).toBe(true);
		});
		test("Non-existent Point", async () => {
			expect(await testCreateLink(1, Number.MAX_VALUE, false, "point not found")).toBe(true);
			expect(await testGetLinks(1, 2, false)).toBe(true);
		});
		test("Non-numerical Hike", async () => {
			expect(await testCreateLink("Number.MAX_VALUE", 2, false, "hike not found")).toBe(true);
			expect(await testGetLinks(1, 2, false)).toBe(true);
		});
		test("Non-numerical Point", async () => {
			expect(await testCreateLink(1, "Number.MAX_VALUE", false, "point not found")).toBe(true);
			expect(await testGetLinks(1, 2, false)).toBe(true);
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
			expect(await testCreateLink(1, 3, true)).toBe(true);
			expect(await testGetLinks(1, 3, true)).toBe(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testCreateLink(Number.MAX_VALUE, 3, false, "hike not found")).toBe(true);
			expect(await testGetLinks(1, 3, false)).toBe(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testCreateLink(1, Number.MAX_VALUE, false, "point not found")).toBe(true);
			expect(await testGetLinks(1, 3, false)).toBe(true);
		});
		test("Non-numerical Hike", async () => {
			expect(await testCreateLink("Number.MAX_VALUE", 3, false, "hike not found")).toBe(true);
			expect(await testGetLinks(1, 3, false)).toBe(true);
		});
		test("Non-numerical Point", async () => {
			expect(await testCreateLink(1, "Number.MAX_VALUE", false, "point not found")).toBe(true);
			expect(await testGetLinks(1, 3, false)).toBe(true);
		});
	});
});

describe("Unit Test: Start/End Points", () => {
	describe("Update Start Points of Hikes", () => {
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
			expect(await testUpdateStartEnd(1, 1, undefined, true)).toBe(true);
			expect(await testGetHikes(1, 1, true, true)).toBe(true);
		});
		// test("Non-existent Hike", async () => {
		// expect(await testUpdateStartEnd(Number.MAX_VALUE, 1, undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, true, false)).toBe(true);
		// });
		test("Non-existent Point", async () => {
			expect(await testUpdateStartEnd(1, Number.MAX_VALUE, undefined, false, "Start point")).toBe(true);
			expect(await testGetHikes(1, 1, true, false)).toBe(true);
		});
		// test("Non-numerical Hike", async () => {
		// expect(await testUpdateStartEnd("Number.MAX_VALUE", 1,undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, true, false)).toBe(true);
		// });
		test("Non-numerical Point", async () => {
			expect(await testUpdateStartEnd(1, "Number.MAX_VALUE", undefined, false, "Start point")).toBe(true);
			expect(await testGetHikes(1, 1, true, false)).toBe(true);
		});
	});

	describe("Update End Points of Hikes", () => {
		beforeEach(() => {
			db.serialize(() => {
				db.exec("PRAGMA foreign_keys = 'ON'");
				db.exec(initQueries);
			});
		});
		// afterAll(() => {
		// 	db.exec(initQueries);
		// });
		test("Normal Call", async () => {
			expect(await testUpdateStartEnd(1, undefined, 1, true)).toBe(true);
			expect(await testGetHikes(1, 1, false, true)).toBe(true);
		});
		// test("Non-existent Hike", async () => {
		// expect(await testUpdateStartEnd(Number.MAX_VALUE, 1, undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, false, false)).toBe(true);
		// });
		test("Non-existent Point", async () => {
			expect(await testUpdateStartEnd(1, undefined, Number.MAX_VALUE, false, "End point")).toBe(true);
			expect(await testGetHikes(1, 1, false, false)).toBe(true);
		});
		// test("Non-numerical Hike", async () => {
		// expect(await testUpdateStartEnd("Number.MAX_VALUE", 1,undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, false, false)).toBe(true);
		// });
		test("Non-numerical Point", async () => {
			expect(await testUpdateStartEnd(1, undefined, "Number.MAX_VALUE", false, "End point")).toBe(true);
			expect(await testGetHikes(1, 1, false, false)).toBe(true);
		});
	});
});
