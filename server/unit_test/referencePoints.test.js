"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const DAORefs = require("../dao/referencePoints");

async function testFactory(IDPoint, IDHike, valid, message) {
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

beforeAll(async () => {
	const setupDB = async () => {
		return new Promise((resolve, reject) => {
			db.exec(
				'PRAGMA foreign_keys = "1"; DROP TABLE IF EXISTS "REFERENCE_POINTS"; CREATE TABLE IF NOT EXISTS "REFERENCE_POINTS" ("IDPoint"	INTEGER NOT NULL,"IDHike"	INTEGER NOT NULL,FOREIGN KEY("IDHike") REFERENCES "HIKES"("IDHike"),FOREIGN KEY("IDPoint") REFERENCES "POINTS"("IDPoint"));',
				function (err) {
					if (err) reject(err);
					else resolve(true);
				}
			);
		});
	};
	await setupDB().catch(err => {
		console.log(err.toString());
		throw err;
	});
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
		test("Non-numerical Point ID", async () => {
			expect(await testFactory("Number.MAX_VALUE", 1, false, "FOREIGN")).toBe(true);
		});
		test("Non-numerical Hike ID", async () => {
			expect(await testFactory(1, "Number.MAX_VALUE", false, "FOREIGN")).toBe(true);
		});
	});
});
