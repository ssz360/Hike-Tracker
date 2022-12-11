"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const crypto = require("crypto");
const DAOUserPref = require("../dao/preferences");

async function testFactoryCreateUserPref(request, message) {
	return await DAOUserPref.addUpdateReference(request).then(
		id => {
			// console.log(id);
			return typeof id === "number";
		},
		err => {
			console.log(err.message ?? err.toString());
			return err.toString().toLowerCase().includes(message);
		}
	);
}

async function testFactoryGetUserPref(userId, predefined, valid, message) {
	return await DAOUserPref.getUserPreferences(userId).then(
		row => {
			// console.log(rows);
			if (valid) return row.keys().every(key => row.key === predefined.key);
			else return row.length === 0;
		},
		err => {
			console.log(err.message ?? err.toString());
			return err.toString().toLowerCase().includes(message);
		}
	);
}

const getRandomInteger = digit => {
	let array = new Uint32Array(1);
	const random = crypto.getRandomValues(array).at(0).toString().slice(0, digit);
	return Number.parseInt(random);
};

describe("Unit Test: User Preference ", () => {
	describe("addUserPreference", () => {
		test("Normal Call", async () => {
			const randUserPref = {
				IDUser: parseInt("jonhutworker@gmail.com"),
				length: getRandomInteger(1),
				ascent: getRandomInteger(3),
				time: getRandomInteger(1)
			};
			expect(await testFactoryCreateUserPref(randUserPref)).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Existent ID", async () => {
			const randUserPref = {
				IDUser: Number.MAX_VALUE,
				length: getRandomInteger(1),
				ascent: getRandomInteger(3),
				time: getRandomInteger(1)
			};
			expect(await testFactoryCreateUserPref(randUserPref, "user")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Numerical ID", async () => {
			const randUserPref = {
				IDUser: "Number.MAX_VALUE",
				length: getRandomInteger(1),
				ascent: getRandomInteger(3),
				time: getRandomInteger(1)
			};
			expect(await testFactoryCreateUserPref(randUserPref, "user")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Numerical Length", async () => {
			const randUserPref = {
				IDUser:  parseInt("jonhutworker@gmail.com"),
				length: "getRandomInteger(1)",
				ascent: getRandomInteger(3),
				time: getRandomInteger(1)
			};
			expect(await testFactoryCreateUserPref(randUserPref, "length")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Numerical Ascent", async () => {
			const randUserPref = {
				IDUser:  parseInt("jonhutworker@gmail.com"),
				length: getRandomInteger(1),
				ascent: "getRandomInteger(3)",
				time: getRandomInteger(1)
			};
			expect(await testFactoryCreateUserPref(randUserPref, "ascent")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Numerical Time", async () => {
			const randUserPref = {
				IDUser:  parseInt("jonhutworker@gmail.com"),
				length: getRandomInteger(1),
				ascent: getRandomInteger(1),
				time: "getRandomInteger(1)"
			};
			expect(await testFactoryCreateUserPref(randUserPref, "time")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});
		// test("Non-existent Point", async () => {
		// 	expect(await testFactoryCreateRef(Number.MAX_VALUE, 1, false, "FOREIGN")).toBe(true);
		// 	expect(await testFactoryGetRefs(1, false)).toBe(true);
		// });
		// test("Non-existent Hike", async () => {
		// 	expect(await testFactoryCreateRef(1, Number.MAX_VALUE, false, "FOREIGN")).toBe(true);
		// 	expect(await testFactoryGetRefs(1, false)).toBe(true);
		// });
		// test("Non-numerical Point ID", async () => {
		// 	expect(await testFactoryCreateRef("Number.MAX_VALUE", 1, false, "FOREIGN")).toBe(true);
		// 	expect(await testFactoryGetRefs(1, false)).toBe(true);
		// });
		// test("Non-numerical Hike ID", async () => {
		// 	expect(await testFactoryCreateRef(1, "Number.MAX_VALUE", false, "FOREIGN")).toBe(true);
		// 	expect(await testFactoryGetRefs(1, false)).toBe(true);
		// });
	});
});
