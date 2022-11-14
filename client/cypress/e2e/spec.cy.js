const testFactory = (testName, country, cord, expectedWarning) => {
	it("Test", () => {
		cy.reload();
		cy.get("input[placeholder=Name]").type("Bad hut" + Math.floor(Math.random() * 10).toString());
		cy.get("input[placeholder=Country]").type(country);
		cy.get("input[placeholder=NumOfGuest]").type(Math.floor(Math.random() * 100));
		cy.get("input[placeholder=NumOfRooms]").type(Math.floor(Math.random() * 100));
		cy.get("input[placeholder=Coordinates]").type(cord);
		cy.contains("Save").click();
		cy.get("div[role=alert]").should("contain", expectedWarning);
	});
};


describe("Registration", () => {
	it("Visit homepage", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign up").click();
		cy.get("[id=floatingName]").type("Sara");
		cy.get("[id=floatingSurname]").type("Bellatorre");
		cy.get("[id=floatingPhone]").type("3312046033");
		cy.get("[id=floatingEmail]").type("sara.bellatorre@gmail.com");
		cy.get("[id=floatingPassword]").type("Password2022!");
		cy.get("[id=floatingPassword2]").type("Password2022!");
		cy.contains("Submit").click();
		cy.contains("Congratulations").click();
	});

	it("Error name", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign up").click();
		cy.get("[id=floatingName]").type("Sar3a");
		cy.get("[id=floatingSurname]").type("Bellatorre");
		cy.get("[id=floatingPhone]").type("3312046033");
		cy.get("[id=floatingEmail]").type("sara.bellatorre@gmail.com");
		cy.get("[id=floatingPassword]").type("Password2022!");
		cy.get("[id=floatingPassword2]").type("Password2022!");
		cy.contains("Submit").click();
		cy.contains("Name is incorrect").click();
	});

	it("Error surname", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign up").click();
		cy.get("[id=floatingName]").type("Sara");
		cy.get("[id=floatingSurname]").type("Bell4torre");
		cy.get("[id=floatingPhone]").type("3312046033");
		cy.get("[id=floatingEmail]").type("sara.bellatorre@gmail.com");
		cy.get("[id=floatingPassword]").type("Password2022!");
		cy.get("[id=floatingPassword2]").type("Password2022!");
		cy.contains("Submit").click();
		cy.contains("Surname is incorrect").click();
	});

	it("Error phone number", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign up").click();
		cy.get("[id=floatingName]").type("Sara");
		cy.get("[id=floatingSurname]").type("Bellatorre");
		cy.get("[id=floatingPhone]").type("33120A46033");
		cy.get("[id=floatingEmail]").type("sara.bellatorre@gmail.com");
		cy.get("[id=floatingPassword]").type("Password2022!");
		cy.get("[id=floatingPassword2]").type("Password2022!");
		cy.contains("Submit").click();
		cy.contains("Phone number is incorrect").click();
	});

	it("Error different passwords", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign up").click();
		cy.get("[id=floatingName]").type("Sara");
		cy.get("[id=floatingSurname]").type("Bellatorre");
		cy.get("[id=floatingPhone]").type("3312046033");
		cy.get("[id=floatingEmail]").type("sara.bellatorre@gmail.com");
		cy.get("[id=floatingPassword]").type("Password202!");
		cy.get("[id=floatingPassword2]").type("Password2022!");
		cy.contains("Submit").click();
		cy.contains("Passwords are different").click();
	});

	it("Error password scheme", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign up").click();
		cy.get("[id=floatingName]").type("Sara");
		cy.get("[id=floatingSurname]").type("Bellatorre");
		cy.get("[id=floatingPhone]").type("3312046033");
		cy.get("[id=floatingEmail]").type("sara.bellatorre@gmail.com");
		cy.get("[id=floatingPassword]").type("pass!");
		cy.get("[id=floatingPassword2]").type("pass!");
		cy.contains("Submit").click();
		cy.contains("characters").click();
	});
});


describe("Login", () => {
	it("Visit homepage", () => {
		cy.reload();
		cy.visit("/");
		cy.contains("Sign in").click();
		cy.get("[id=floatingInput]").type("dragonzhao1992@gmail.com");
		cy.get("[id=floatingPassword]").type("Zazaza1234!");
		cy.contains("Submit").click();
		//cy.url().should("include", "dragonzhao1992@gmail.com");
		cy.contains("Add Hut").click();
	});
});

describe("Test submit huts", () => {
	testFactory("testInvalidCountryName", "123123213", "2,2", "country");
	testFactory("testNonTwoDimensionalCoordiante1", "Italy", "1", "coordinates");
	testFactory("testNonTwoDimensionalCoordiante2", "Italy", "1,2,3", "coordinates");
	testFactory("testNonNumericalCoordiante", "Italy", "qwdqwd", "coordinates");
	testFactory("testNonNumericalCoordiante", "Italy", "2,3123qwdqwd", "coordinates");
});

describe("Good Submit", () => {
	it("Visit homepage", () => {
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
