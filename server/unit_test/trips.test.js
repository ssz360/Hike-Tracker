"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const DAOTrips = require("../dao/trips");
const init_Quires =
	"PRAGMA foreign_keys = '1'; DROP TABLE IF EXISTS Trips;CREATE TABLE IF NOT EXISTS Trips (IDTrip INTEGER PRIMARY KEY AUTOINCREMENT,IDHike INTEGER NOT NULL,IDUser TEXT NOT NULL,start_time TEXT NOT NULL,end_time TEXT,ID_last_ref INTEGER NOT NULL,status TEXT NOT NULL,FOREIGN KEY(IDHike) REFERENCES Hikes(IDHike),FOREIGN KEY(IDUser) REFERENCES Users(Username),FOREIGN KEY(ID_last_ref) REFERENCES Points(IDPoint)); ";

async function testFactoryCreateTrip(IDHike, IDUser, start_time, ID_start_point, valid, message) {
	return await DAOTrips.addTrip(IDHike, IDUser, start_time, ID_start_point).then(
		id => {
			// console.log(id);
			if (valid) return id;
			else return id === undefined;
		},
		err => {
			console.log(err.message);
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
			expect(await testFactoryCreateTrip(1, "davidwallace@gmail.com", "2019-01-01 00:00:00", 1, true)).toBe(1);
			expect(await testFactoryGetTrip(1, true)).toEqual({
				IDHike: 1,
				IDTrip: 1,
				IDUser: "davidwallace@gmail.com",
				ID_last_ref: 1,
				end_time: null,
				start_time: "2019-01-01 00:00:00",
				status: "ongoing"
			});
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
		test("Invalid start_time", async () => {
			expect(
				await testFactoryCreateTrip(
					1,
					"davidwallace@gmail.com",
					"Not A Time",
					1,
					false,
					"not null constraint failed"
				)
			).toBe(true);
			expect(await testFactoryGetTrip(1, false)).toBe(true);
		});
	});
});
