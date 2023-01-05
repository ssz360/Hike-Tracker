"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const DAOHikes = require("../dao/hikes");
const DAORefs = require("../dao/referencePoints");
const DAOPoints = require("../dao/points");

const initQueries =`DELETE FROM REFERENCE_POINTS;
					DELETE FROM HUTS;
					DELETE FROM PARKINGS;
					DELETE FROM HIKESCOORDINATES;
					DELETE FROM HIKESMAPDATA;
					DELETE FROM LINKEDPOINTS;
					DELETE FROM POINTSIMAGES;
					DELETE FROM PREFERENCES;
					DELETE FROM USERS;
					DELETE FROM HIKES;
					DELETE FROM POINTS;
					DELETE FROM sqlite_sequence;
					INSERT INTO HUTS (IDPoint, Email, Phone, NumberOfBedRooms) VALUES ( 14, 'Italy', 20, 5), ( 16, 'Italy', 30, 17), ( 17, 'Italy', 35, 7), ( 19, 'Italy', 20, 10), ( 21, 'Italy', 30, 17), ( 22, 'Italy', 30, 17), ( 23, 'Italy', 2, 5);
					INSERT INTO PARKINGS (IDPoint, SlotsTot, SlotsFull) VALUES ( 13, 60, 23), ( 15, 20, 11), ( 18, 80, 59), ( 20, 80, 80);
					INSERT INTO POINTS(IDPoint, Name, Latitude, Longitude, Altitude, Country, TypeOfPoint,Description,Province,Region) VALUES ( 1, 'Default starting point for hike Lago di Afframont',44.589284565299749,7.203381098806858,66,'','hikePoint','desc','piemonte','turin'), ( 2, 'Default arrival point for hike Lago di Afframont',44.613320929929614,7.07638755440712,66,'','hikePoint','desc','piemonte','turin'), ( 3, 'Default starting point for hike Rifugio Gastaldi',45.177786,7.083372,66,'','hikePoint','desc','piemonte','turin'), ( 4, 'Default arrival point for hike Rifugio Gastaldi',45.203531,7.077340,66,'','hikePoint','desc','piemonte','turin'), ( 5, 'Default starting point for hike Rifugio Gastaldi',44.589284565299749,7.203381098806858,66,'','hikePoint','desc','piemonte','turin'), ( 6, 'Default arrival point for hike Rifugio Gastaldi',44.613320929929614,7.07638755440712,66,'','hikePoint','desc','piemonte','turin'), ( 7, 'Default starting point for hike Bivacco Gias Nuovo',45.177786,7.083372,66,'','hikePoint','desc','piemonte','turin'), ( 8, 'Default arrival point for hike Bivacco Gias Nuovo',45.203531,7.077340,66,'','hikePoint','desc','piemonte','turin'), ( 9, 'Default starting point for hike Santa Cristina',44.589284565299749,7.203381098806858,66,'','hikePoint','desc','piemonte','turin'), ( 10, 'Default arrival point for hike Santa Cristina',44.613320929929614,7.07638755440712,66,'','hikePoint','desc','piemonte','turin'), ( 11, 'Default starting point for hike Rocciamelone',45.177786,7.083372,66,'','hikePoint','desc','piemonte','turin'), ( 12, 'Default arrival point for hike Rocciamelone',45.203531,7.077340,66,'','hikePoint','desc','piemonte','turin'), ( 13, 'Parcheggio Balme',44.701004142314196, 7.139863958582282 , 66, 'Piedmont', 'Parking','desc','piemonte','turin'), ( 14, 'Rifugio del Gufo', 44.601004142314196, 7.339863958582282,66, 'Piedmont', 'Hut','desc','piemonte','turin'), ( 15, 'Parcheggio Graie', 45.3906585, 7.079086, 66, 'Piedmont', 'Parking','desc','piemonte','turin'), ( 16, 'Rifugio Ciamarella', 45.1906585, 7.279086,  66, 'Piedmont', 'Hut','desc','piemonte','turin'), ( 17, 'Rifugio Castaldi', 44.1906585, 7.079086,  66, 'Piedmont', 'Hut','desc','piemonte','turin'), ( 18, 'Parcheggio Forno Alpi', 45.1906585, 6.8979086,  66, 'Piedmont', 'Parking','desc','piemonte','turin'), ( 19, 'Bivacco Gias Nuovo', 45.3906585, 7.279086,  66, 'Piedmont', 'Hut','desc','piemonte','turin'), ( 20, 'Parcheggio Cantoira', 45.1906585, 8.079086,  66, 'Piedmont', 'Parking','desc','piemonte','turin'), ( 21, 'Bivacco di Santa Cristina', 44.901004142314196, 7.339863958582282 ,  66, 'Piedmont', 'Hut','desc','piemonte','turin'), ( 22, 'Rifugio La Riposa', 45.701004142314196, 7.139863958582282,  66, 'Piedmont', 'Hut','desc','piemonte','turin'), ( 23, 'Casa Viù', 44.701004142314196, 8.139863958582282,  66, 'Piedmont', 'Hut','desc','piemonte','turin');
					INSERT INTO HIKES (Name , Author, Length, ExpectedTime, Ascent, Difficulty, StartPoint, EndPoint, CenterLat, CenterLon, Description) VALUES ( 'Lago di Afframont', 's292671@studenti.polito.it', 3, 7.5, 400, 'TOURIST', 1, 2, 44.601004142314196, 7.139863958582282, 'Here the reflections of the snow-capped mountains and the larch trees in autumnal garments create a truly unique setting. The excursion takes place on a path, initially inside a dense forest while, in the last part, wide plateaus and old pastures follow one another. The lake is set in a basin with a particular and suggestive setting'), ('Rifugio Gastaldi', 'jonhutworker@gmail.com', 4, 13, 550, 'HIKER', 3, 4, 45.1906585, 7.079086, 'Ciamarella (3767 m), the highest of the Lanzo Valleys. There is also a beautiful view towards the Crot del Ciaussinè basin , with its lakes, and the surrounding peaks.'), ('Rifugio Gastaldi', 'jonhutworker@gmail.com', 4, 7, 550, 'HIKER', 5, 6, 44.601004142314196, 7.139863958582282, 'Ciamarella (3767 m), the highest of the Lanzo Valleys. There is also a beautiful view towards the Crot del Ciaussinè basin , with its lakes, and the surrounding peaks.'), ('Bivacco Gias Nuovo', 's292671@studenti.polito.it', 8.5, 2.45, 450, 'PROFESSIONAL HIKER', 7, 8, 45.1906585, 7.079086, 'The Gias Nuovo Bivouac is located in the Vallone Di Sea, in the Val Grande , in Forno Alpi Graie at an altitude of 1893 m. The excursion develops entirely on a path that climbs quite steep at times. The bivouac is located at the end of the vast and wide plateau of Gias Nuovo. It is a bivouac built in 2019 entirely of wood and with a very particular shape.'), ('Santa Cristina', 'jonhutworker@gmail.com', 13.5, 1.30, 7500, 'PROFESSIONAL HIKER', 9, 10, 44.601004142314196, 7.139863958582282, 'The Sanctuary of Santa Cristina is located on a rocky spur overlooking the entrance to two valleys: Val Grande and Val d Ala. It is located at an altitude of 1340 m. The Sanctuary stands out above a staircase and its position allows you to admire the main peaks of the Lanzo Valleys.'), ('Rocciamelone', 's292671@studenti.polito.it', 3, 2.30, 1650, 'HIKER', 11, 12, 45.1906585, 7.079086, 'The climb to Rocciamelone is a great classic of excursions in Piedmont and in the Val di Susa in particular. It is in fact a very coveted peak frequented by Piedmontese hikers and beyond. It is located at an altitude of 3538 m and on its top there is the highest sanctuary in Europe , a bronze statue of the Madonna and the Bivouac Rifugio Santa Maria. Rocciamelone is a mountain that divides the Val di Susa from the Val di Viù . In fact, the territories of Mompantero, Novalesa and Usseglio converge on the summit. From the top the view sweeps over Monviso , Mont Blanc , Gran Paradiso , Monte Rosa and the Turin hills. A view to take your breath away.');
					`;

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
	return await DAOHikes.getReferencesPoints(IDHike).then(
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
						return isStartPoint ? p.startPoint.id === IDPoint : p.endPoint.id === IDPoint;
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
			expect(await testUpdateStartEnd(1, 9, undefined, true)).toBe(true);
			expect(await testGetHikes(1, 9, true, true)).toBe(true);
		});
		// test("Non-existent Hike", async () => {
		// expect(await testUpdateStartEnd(Number.MAX_VALUE, 1, undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, true, false)).toBe(true);
		// });
		test("Non-existent Point", async () => {
			expect(await testUpdateStartEnd(1, Number.MAX_VALUE, undefined, false, "Start point")).toBe(true);
			expect(await testGetHikes(1, 9, true, false)).toBe(true);
		});
		// test("Non-numerical Hike", async () => {
		// expect(await testUpdateStartEnd("Number.MAX_VALUE", 1,undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, true, false)).toBe(true);
		// });
		test("Non-numerical Point", async () => {
			expect(await testUpdateStartEnd(1, "Number.MAX_VALUE", undefined, false, "Start point")).toBe(true);
			expect(await testGetHikes(1, 9, true, false)).toBe(true);
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
			expect(await testUpdateStartEnd(1, undefined, 9, true)).toBe(true);
			expect(await testGetHikes(1, 9, false, true)).toBe(true);
		});
		// test("Non-existent Hike", async () => {
		// expect(await testUpdateStartEnd(Number.MAX_VALUE, 1, undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, false, false)).toBe(true);
		// });
		test("Non-existent Point", async () => {
			expect(await testUpdateStartEnd(9, undefined, Number.MAX_VALUE, false, "End point")).toBe(true);
			expect(await testGetHikes(1, 9, false, false)).toBe(true);
		});
		// test("Non-numerical Hike", async () => {
		// expect(await testUpdateStartEnd("Number.MAX_VALUE", 1,undefined, false, "Start point")).toBe(true);
		// expect(await testGetHikes(1, 1, false, false)).toBe(true);
		// });
		test("Non-numerical Point", async () => {
			expect(await testUpdateStartEnd(1, undefined, "Number.MAX_VALUE", false, "End point")).toBe(true);
			expect(await testGetHikes(1, 9, false, false)).toBe(true);
		});
	});
});
