jest.mock("../dao/dao");

const db = require("../dao/dao");
const DAOTrips = require("../dao/trips");
const init_Quires =
	"PRAGMA foreign_keys = '1'; DELETE FROM TRIPS; DELETE FROM sqlite_sequence WHERE name = 'TRIPS';";

async function testFactoryCreateTrip(
	IDHike,
	IDUser,
	start_time,
	ID_start_point,
	valid,
	message
) {
	return await DAOTrips.addTrip(
		IDHike,
		start_time,
		IDUser,
		ID_start_point
	).then(
		id => {
			// console.log(id);
			if (valid) return id;
			else return id === undefined;
		},
		err => {
			// console.log(err.message);
			return err.message.toLowerCase().includes(message);
		}
	);
}

async function testFactoryGetTrip(IDTrip, valid, message) {
	return await DAOTrips.getTrip(IDTrip).then(
		row => {
			// console.log(row);
			if (valid) return row;
			else return row === undefined;
		},
		err => {
			// console.log(err.message);
			return err.message.toLowerCase().includes(message);
		}
	);
}

describe("Unit Test: Trips", () => {
	beforeEach(() => {
		db.exec(init_Quires, err => {
			if (err) console.log(err);
		});
	});
	describe("addTrip", () => {
		test("Normal Call", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"davidwallace@gmail.com",
					"2019-01-01 00:00:00",
					1,
					true
				)
			).toBe(1);
			const expectedReturn = {
				IDHike: 1,
				IDTrip: 1,
				IDUser: "davidwallace@gmail.com",
				ID_last_ref: 1,
				end_time: null,
				last_seg_duration: 0,
				last_seg_end_time: "2019-01-01 00:00:00",
				start_time: "2019-01-01 00:00:00",
				status: "Ongoing"
			};
			expect(await testFactoryGetTrip(1, true)).toEqual(expectedReturn);
			expect(
				await DAOTrips.getCurrentTrip("davidwallace@gmail.com")
			).toEqual({
				IDTrip: 1,
				hikeId: 1,
				secsFromLastStop: 0,
				start: "2019-01-01 00:00:00",
				stopped: false,
				stoppedAt: "2019-01-01 00:00:00"
			});
			expect(
				await DAOTrips.getAllTripsByUser("davidwallace@gmail.com")
			).toEqual([expectedReturn]);
			expect(await DAOTrips.getAllTripsByHike(1)).toEqual([
				expectedReturn
			]);
		});
		test("Invalid IDHike", async () => {
			expect(
				await testFactoryCreateTrip(
					Number.MAX_VALUE,
					"davidwallace@gmail.com",
					"2019-01-01 00:00:00",
					1,
					false,
					"foreign key constraint failed"
				)
			).toBe(true);
			expect(await testFactoryGetTrip(1, false)).toBe(true);
		});
		test("Invalid IDUser", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"Number.MAX_VALUE",
					"2019-01-01 00:00:00",
					1,
					false,
					"foreign key constraint failed"
				)
			).toBe(true);
			expect(await testFactoryGetTrip(1, false)).toBe(true);
		});
		test("Invalid ID_start_point", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"davidwallace@gmail.com",
					"2019-01-01 00:00:00",
					Number.MAX_VALUE,
					false,
					"foreign key constraint failed"
				)
			).toBe(true);
			expect(await testFactoryGetTrip(1, false)).toBe(true);
		});
	});
	describe("Pausing a trip", () => {
		test("Normal Call", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"davidwallace@gmail.com",
					"2019-01-01 00:00:00",
					1,
					true
				)
			).toBe(1);
			expect(await DAOTrips.pauseTrip(1, 100, Date.now())).toEqual(1);
		});
		test("Invalid IDHike", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"davidwallace@gmail.com",
					"2019-01-01 00:00:00",
					1,
					true
				)
			).toBe(1);
			expect(
				await DAOTrips.pauseTrip(
					Number.MAX_VALUE,
					100,
					Date.now()
				).catch(err => err.message)
			).toEqual("Trip not found");
		});
	});
	describe("Resuming a trip", () => {
		test("Normal Call", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"davidwallace@gmail.com",
					"2019-01-01 00:00:00",
					1,
					true
				)
			).toBe(1);
			expect(await DAOTrips.resumeTrip(1, Date.now())).toEqual(1);
		});
		test("Invalid IDHike", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"davidwallace@gmail.com",
					"2019-01-01 00:00:00",
					1,
					true
				)
			).toBe(1);
			expect(
				await DAOTrips.resumeTrip(Number.MAX_VALUE, Date.now()).catch(
					err => err.message
				)
			).toEqual("Trip not found");
		});
	});
});
