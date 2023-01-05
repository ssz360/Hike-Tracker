"use strict";

jest.mock("../dao/dao");
const db = require("../dao/dao");
const crypto = require("crypto").webcrypto;
const DAOUserPref = require("../dao/preferences");

async function testFactoryCreateUserPref(request, message) {
	return await DAOUserPref.addUpdateReference(request).then(
		id => {
			// console.log(id);
			return typeof id === "number";
		},
		err => {
			console.log(err.message ?? err.toString());
			return err.message.toString().toLowerCase().includes(message);
		}
	);
}

async function testFactoryGetUserPref(userId, predefined, valid, message) {
	return await DAOUserPref.getUserPreferences(userId).then(
		row => {
			if(!row) return true;
			var key1 = Object.values(row).sort();
			var keys2 = Object.values(predefined).sort();			// console.log(rows);
			if (valid) return JSON.stringify(key1) === JSON.stringify(keys2);
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
		beforeEach(() => {
			db.exec(`
			INSERT INTO USERS(Username, Type, Password, Salt,Name,Surname,PhoneNumber)
			SELECT
			'jonhutworker@gmail.com',  'localGuide',  '5cb69c67556b1e6d37972a42a644e34c07db6711003395b58c5365a5c521f12f','6ab29d4b3b4a39c3e39a81c2e33940e3',  'Jon',  'Black',  '1234567890'
			WHERE NOT EXISTS (SELECT * FROM USERS WHERE Username = 'jonhutworker@gmail.com')
			`);
		});
		test("Normal Call", async () => {
			const randUserPref = {
				IDUser: 'jonhutworker@gmail.com',
				minLength: getRandomInteger(1),
				maxLength: getRandomInteger(1),
				minAscent: getRandomInteger(3),
				maxAscent: getRandomInteger(3),
				minTime: getRandomInteger(1),
				maxTime: getRandomInteger(1),
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

		test("Non-Numerical ID", async () => {;
			
			const randUserPref = {
				IDUser: "Number.MAX_VALUE",
				minLength: getRandomInteger(1),
				maxLength: getRandomInteger(1),
				minAscent: getRandomInteger(3),
				maxAscent: getRandomInteger(3),
				minTime: getRandomInteger(1),
				maxTime: getRandomInteger(1),
			};

			expect(await testFactoryCreateUserPref(randUserPref, "user")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Numerical Length", async () => {
			const randUserPref = {
				IDUser: 'jonhutworker@gmail.com',
				minLength:"getRandomInteger(1)",
				maxLength: getRandomInteger(1),
				minAscent: getRandomInteger(3),
				maxAscent: getRandomInteger(3),
				minTime: getRandomInteger(1),
				maxTime: getRandomInteger(1),
			};

			expect(await testFactoryCreateUserPref(randUserPref, "length")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Numerical Ascent", async () => {

			const randUserPref = {
				IDUser: 'jonhutworker@gmail.com',
				minLength: getRandomInteger(1),
				maxLength: getRandomInteger(1),
				minAscent: "getRandomInteger(3)",
				maxAscent: getRandomInteger(3),
				minTime: getRandomInteger(1),
				maxTime: getRandomInteger(1),
			};

			
			expect(await testFactoryCreateUserPref(randUserPref, "ascent")).toBe(true);
			expect(await testFactoryGetUserPref(randUserPref.IDUser, randUserPref, true)).toBe(true);
		});

		test("Non-Numerical Time", async () => {
			const randUserPref = {
				IDUser: 'jonhutworker@gmail.com',
				minLength: getRandomInteger(1),
				maxLength: getRandomInteger(1),
				minAscent: getRandomInteger(3),
				maxAscent: getRandomInteger(3),
				minTime: "getRandomInteger(1)",
				maxTime: getRandomInteger(1),
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
