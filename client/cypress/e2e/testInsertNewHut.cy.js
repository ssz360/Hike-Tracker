const testFactory = (testName, name, country, cord, expectedWarning) => {
	it(testName, () => {
		cy.reload();
		cy.get("input[placeholder=Name]").type(name);
		cy.get("input[placeholder=Country]").type(country);
		cy.get("input[placeholder=NumOfGuest]").type(Math.floor(Math.random() * 100));
		cy.get("input[placeholder=NumOfRooms]").type(Math.floor(Math.random() * 100));
		cy.get("input[placeholder=Coordinates]").type(cord);
		cy.contains("Save").click();
		cy.get("div[role=alert]").should("contain", expectedWarning);
	});
};

describe("Login", () => {
	it("Visit homepage", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign in").click();
		cy.get("[id=floatingInput]").type("dragonzhao1992@gmail.com");
		cy.get("[id=floatingPassword]").type("Zazaza1234!");
		cy.contains("Submit").click();
		cy.url().should("include", "dragonzhao1992@gmail.com");
		cy.contains("Add Hut").click();
	});
});

describe("Test submit huts", () => {
	testFactory("testInvalidHutName", "     ", "123123213", "2,2", "hut");
	testFactory(
		"testInvalidCountryName",
		"Bad hut" + Math.floor(Math.random() * 10).toString(),
		"123123213",
		"2,2",
		"country"
	);
	testFactory(
		"testNonTwoDimensionalCoordiante1",
		"Bad hut" + Math.floor(Math.random() * 10).toString(),
		"Italy",
		"1",
		"coordinates"
	);
	testFactory(
		"testNonTwoDimensionalCoordiante2",
		"Bad hut" + Math.floor(Math.random() * 10).toString(),
		"Italy",
		"1,2,3",
		"coordinates"
	);
	testFactory(
		"testNonNumericalCoordiante",
		"Bad hut" + Math.floor(Math.random() * 10).toString(),
		"Italy",
		"qwdqwd",
		"coordinates"
	);
	testFactory(
		"testNonNumericalCoordiante",
		"Bad hut" + Math.floor(Math.random() * 10).toString(),
		"Italy",
		"2,3123qwdqwd",
		"coordinates"
	);
});

describe("Empty Submit", () => {
	it("Test", () => {
		cy.reload();
		cy.contains("Save").click();
		cy.get("div[role=alert]").should("contain", "fields");
	});
});

describe("Good Submit", () => {
	it("Test", () => {
		cy.reload();
		cy.get("input[placeholder=Name]").type("Good hut");
		cy.get("input[placeholder=Country]").type("Italy");
		cy.get("input[placeholder=NumOfGuest]").type("10");
		cy.get("input[placeholder=NumOfRooms]").type("10");
		cy.get("input[placeholder=Coordinates]").type("1,1");
		cy.contains("Save").click();
		cy.url().should("eq", "http://localhost:3000/");
	});
});
