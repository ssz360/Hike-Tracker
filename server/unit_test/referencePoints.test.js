"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const DAORefs = require("../dao/referencePoints");

async function testFactoryCreateRef(IDPoint, IDHike, valid, message) {
	return await DAORefs.createReferencePoint(IDPoint, IDHike).then(
		id => {
			// console.log(id);
			if (valid) return id;
			else return id === undefined;
		},
		err => {
			// console.log(err.toString());
			return err.toString().includes(message);
		}
	);
}

async function testFactoryGetRefs(IDHike, valid, message) {
	return await DAORefs.getReferencesPoints(IDHike).then(
		rows => {
			// console.log(rows);
			if (valid) return rows;
			else return rows.length === 0;
		},
		err => {
			// console.log(err.toString());
			return err.toString().includes(message);
		}
	);
}

describe("Unit Test: Reference Points", () => {
	describe("addReferencePoint", () => {
		beforeEach(() => {
			db.exec(
				'PRAGMA foreign_keys = "1"; DROP TABLE IF EXISTS "REFERENCE_POINTS"; CREATE TABLE IF NOT EXISTS "REFERENCE_POINTS" ("IDPoint"	INTEGER NOT NULL,"IDHike"	INTEGER NOT NULL,FOREIGN KEY("IDHike") REFERENCES "HIKES"("IDHike"),FOREIGN KEY("IDPoint") REFERENCES "POINTS"("IDPoint"));'
			);
		});
		test("Normal Call", async () => {
			expect(await testFactoryCreateRef(1, 1, true)).toBe(1);
			expect(await testFactoryGetRefs(1, true)).toEqual([1]);
		});
		test("Non-existent Point", async () => {
			expect(await testFactoryCreateRef(Number.MAX_VALUE, 1, false, "FOREIGN")).toBe(true);
			expect(await testFactoryGetRefs(1, false)).toBe(true);
		});
		test("Non-existent Hike", async () => {
			expect(await testFactoryCreateRef(1, Number.MAX_VALUE, false, "FOREIGN")).toBe(true);
			expect(await testFactoryGetRefs(1, false)).toBe(true);
		});
		test("Non-numerical Point ID", async () => {
			expect(await testFactoryCreateRef("Number.MAX_VALUE", 1, false, "FOREIGN")).toBe(true);
			expect(await testFactoryGetRefs(1, false)).toBe(true);
		});
		test("Non-numerical Hike ID", async () => {
			expect(await testFactoryCreateRef(1, "Number.MAX_VALUE", false, "FOREIGN")).toBe(true);
			expect(await testFactoryGetRefs(1, false)).toBe(true);
		});
	});
});
