jest.mock("../dao/dao");

const DAORefs = require("../dao/referencePoints");
const db = require("../dao/dao");

async function testFactoryCreateRef(IDPoint, IDHike, valid, message) {
	return await DAORefs.createReferencePoint(IDPoint, IDHike).then(
		id => {
			console.log(id);
			if (valid) return id;
			else return id === undefined;
		},
		err => {
			console.log(err.message ? err.message : err.toString());
			return err.message
				? err.message.includes(message)
				: err.toString().includes(message);
		}
	);
}

async function testFactoryGetRefs(IDHike, valid, message) {
	return await DAORefs.getReferencesPoints(IDHike).then(
		rows => {
			console.log(rows);
			if (valid) return rows;
			else return rows.length === 0;
		},
		err => {
			console.log(err.message ? err.message : err.toString());
			return err.message
				? err.message.includes(message)
				: err.toString().includes(message);
		}
	);
}

describe("Unit Test: Reference Points", () => {
	beforeEach(async () => {
		db.run("PRAGMA foreign_keys = '1';", err => {
			if (err) console.log(err);
		});
	});
	describe("addReferencePoint", () => {
		test("Normal Call", async () => {
			expect(await testFactoryCreateRef(1, 50, true)).toBe(68);
			expect(
				await testFactoryGetRefs(50, true).then(rows => rows.length)
			).toEqual(3);
			expect(await DAORefs.deleteReferencePoint(1, 50)).toBe(1);
		});
		test("Non-Existent Hike ID", async () => {
			expect(
				await testFactoryCreateRef(
					1,
					Number.MAX_VALUE,
					false,
					"FOREIGN"
				)
			).toBe(true);
			expect(
				await testFactoryGetRefs(50, true).then(
					rows => rows.length === 2
				)
			).toBe(true);
			expect(
				await DAORefs.deleteReferencePoint(1, 50).catch(
					err => err.message
				)
			).toEqual("Reference point not found.");
		});
		test("Non-Existent Point ID", async () => {
			expect(
				await testFactoryCreateRef(
					Number.MAX_VALUE,
					1,
					false,
					"FOREIGN"
				)
			).toBe(true);
			expect(
				await testFactoryGetRefs(50, true).then(
					rows => rows.length === 2
				)
			).toBe(true);
			expect(
				await DAORefs.deleteReferencePoint(1, 50).catch(
					err => err.message
				)
			).toEqual("Reference point not found.");
		});
	});
});
