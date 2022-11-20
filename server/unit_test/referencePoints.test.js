"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const DAORefs = require("../dao/referencePoints");

async function testFactory(IDPoint, IDHike, valid, message) {
	return await DAORefs.createReferencePoint(IDPoint, IDHike).then(
		id => {
			console.log(id);
			if (valid) return id;
			else return id === undefined;
		},
		err => {
			console.log(err.toString());
			return err.toString().includes(message);
		}
	);
}

beforeAll(() => {
	db.run('DROP TABLE IF EXISTS "REFERENCE_POINTS";');
	db.run(
		'CREATE TABLE IF NOT EXISTS "REFERENCE_POINTS" ("IDPoint"	INTEGER NOT NULL,"IDHike"	INTEGER NOT NULL,FOREIGN KEY("IDHike") REFERENCES "HIKES"("IDHike"),FOREIGN KEY("IDPoint") REFERENCES "POINTS"("IDPoint"));'
	);
});

describe("Unit Test: Reference Points", () => {
	describe("addReferencePoint", () => {
		test("Normal Call", async () => {
			expect(await testFactory(1, 1, true)).toBe(1);
		});
		test("Non-existent Point", async () => {
			expect(await testFactory(Number.MAX_VALUE, 1, false, "FOREIGN")).toBe(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testFactory(1, Number.MAX_VALUE, false, "FOREIGN")).toBe(true);
		});
		// test("Normal Call", async () => {
		// 	expect(await testFactory(1, 1, true)).toBe(true);
		// });
		// test("Normal Call", async () => {
		// 	expect(await testFactory(1, 1, true)).toBe(true);
		// });
	});
});
