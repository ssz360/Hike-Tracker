"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { beforeEach } = require("mocha");
chai.use(chaiHttp);
chai.should();

const db = require("../dao/__mocks__/dao");
const app = require("../index");
const agent = chai.request.agent(app);

const APIAddRef = "/api/addReferenceToHike";
const APIUpdateStartEnd = "/api/updateStartEndPoint";
const loginRef="/api/login";
const loginUser={username:"davidwallace@gmail.com",password:"123abcABC!"};
/*const initQueries =
	"DELETE FROM REFERENCE_POINTS; DELETE FROM HUTS; DELETE FROM PARKINGS; DELETE FROM POINTS; DELETE FROM HIKES; DELETE FROM sqlite_sequence; INSERT INTO HUTS (IDPoint, Country, NumberOfGuests, NumberOfBedRooms) VALUES ( 14, 'Italy', 20, 5), ( 16, 'Italy', 30, 17), ( 17, 'Italy', 35, 7), ( 19, 'Italy', 20, 10), ( 21, 'Italy', 30, 17), ( 22, 'Italy', 30, 17), ( 23, 'Italy', 2, 5); INSERT INTO PARKINGS (IDPoint, Description, SlotsTot, SlotsFull) VALUES ( 13, 'Lorem ipsum', 60, 23), ( 15, 'Dolor sit amet', 20, 11), ( 18, 'Cras justo odio', 80, 59), ( 20, 'Full',80,80); INSERT INTO POINTS(IDPoint, Name, Latitude, Longitude, GeographicalArea, TypeOfPoint) VALUES ( 1, 'Default starting point for hike Lago di Afframont',44.589284565299749,7.203381098806858,'','hikePoint'), ( 2, 'Default arrival point for hike Lago di Afframont',44.613320929929614,7.07638755440712,'','hikePoint'), ( 3, 'Default starting point for hike Rifugio Gastaldi',45.177786,7.083372,'','hikePoint'), ( 4, 'Default arrival point for hike Rifugio Gastaldi',45.203531,7.077340,'','hikePoint'), ( 5, 'Default starting point for hike Rifugio Gastaldi',44.589284565299749,7.203381098806858,'','hikePoint'), ( 6, 'Default arrival point for hike Rifugio Gastaldi',44.613320929929614,7.07638755440712,'','hikePoint'), ( 7, 'Default starting point for hike Bivacco Gias Nuovo',45.177786,7.083372,'','hikePoint'), ( 8, 'Default arrival point for hike Bivacco Gias Nuovo',45.203531,7.077340,'','hikePoint'), ( 9, 'Default starting point for hike Santa Cristina',44.589284565299749,7.203381098806858,'','hikePoint'), ( 10, 'Default arrival point for hike Santa Cristina',44.613320929929614,7.07638755440712,'','hikePoint'), ( 11, 'Default starting point for hike Rocciamelone',45.177786,7.083372,'','hikePoint'), ( 12, 'Default arrival point for hike Rocciamelone',45.203531,7.077340,'','hikePoint'), ( 13, 'Parcheggio Balme',44.701004142314196, 7.139863958582282 , 'Piedmont', 'Parking'), ( 14, 'Rifugio del Gufo', 44.601004142314196, 7.339863958582282, 'Piedmont', 'Hut'), ( 15, 'Parcheggio Graie', 45.3906585, 7.079086, 'Piedmont', 'Parking'), ( 16, 'Rifugio Ciamarella', 45.1906585, 7.279086, 'Piedmont', 'Hut'), ( 17, 'Rifugio Castaldi', 44.1906585, 7.079086, 'Piedmont', 'Hut'), ( 18, 'Parcheggio Forno Alpi', 45.1906585, 6.8979086, 'Piedmont', 'Parking'), ( 19, 'Bivacco Gias Nuovo', 45.3906585, 7.279086, 'Piedmont', 'Hut'), ( 20, 'Parcheggio Cantoira', 45.1906585, 8.079086, 'Piedmont', 'Parking'), ( 21, 'Bivacco di Santa Cristina', 44.901004142314196, 7.339863958582282 , 'Piedmont', 'Hut'), ( 22, 'Rifugio La Riposa', 45.701004142314196, 7.139863958582282, 'Piedmont', 'Hut'), ( 23, 'Casa Viù', 44.701004142314196, 8.139863958582282, 'Piedmont', 'Hut'); INSERT INTO HIKES (Name , Author, Length, ExpectedTime, Ascent, Difficulty, StartPoint, EndPoint, CenterLat, CenterLon, Description) VALUES ( 'Lago di Afframont', 's292671@studenti.polito.it', 3, 7.5, 400, 'TOURIST', 1, 2, 44.601004142314196, 7.139863958582282, 'Here the reflections of the snow-capped mountains and the larch trees in autumnal garments create a truly unique setting. The excursion takes place on a path, initially inside a dense forest while, in the last part, wide plateaus and old pastures follow one another. The lake is set in a basin with a particular and suggestive setting'), ('Rifugio Gastaldi', 'jonhutworker@gmail.com', 4, 13, 550, 'HIKER', 3, 4, 45.1906585, 7.079086, 'Ciamarella (3767 m), the highest of the Lanzo Valleys. There is also a beautiful view towards the Crot del Ciaussinè basin , with its lakes, and the surrounding peaks.'), ('Rifugio Gastaldi', 'jonhutworker@gmail.com', 4, 7, 550, 'HIKER', 5, 6, 44.601004142314196, 7.139863958582282, 'Ciamarella (3767 m), the highest of the Lanzo Valleys. There is also a beautiful view towards the Crot del Ciaussinè basin , with its lakes, and the surrounding peaks.'), ('Bivacco Gias Nuovo', 's292671@studenti.polito.it', 8.5, 2.45, 450, 'PROFESSIONAL HIKER', 7, 8, 45.1906585, 7.079086, 'The Gias Nuovo Bivouac is located in the Vallone Di Sea, in the Val Grande , in Forno Alpi Graie at an altitude of 1893 m. The excursion develops entirely on a path that climbs quite steep at times. The bivouac is located at the end of the vast and wide plateau of Gias Nuovo. It is a bivouac built in 2019 entirely of wood and with a very particular shape.'), ('Santa Cristina', 'jonhutworker@gmail.com', 13.5, 1.30, 7500, 'PROFESSIONAL HIKER', 9, 10, 44.601004142314196, 7.139863958582282, 'The Sanctuary of Santa Cristina is located on a rocky spur overlooking the entrance to two valleys: Val Grande and Val d Ala. It is located at an altitude of 1340 m. The Sanctuary stands out above a staircase and its position allows you to admire the main peaks of the Lanzo Valleys.'), ('Rocciamelone', 's292671@studenti.polito.it', 3, 2.30, 1650, 'HIKER', 11, 12, 45.1906585, 7.079086, 'The climb to Rocciamelone is a great classic of excursions in Piedmont and in the Val di Susa in particular. It is in fact a very coveted peak frequented by Piedmontese hikers and beyond. It is located at an altitude of 3538 m and on its top there is the highest sanctuary in Europe , a bronze statue of the Madonna and the Bivouac Rifugio Santa Maria. Rocciamelone is a mountain that divides the Val di Susa from the Val di Viù . In fact, the territories of Mompantero, Novalesa and Usseglio converge on the summit. From the top the view sweeps over Monviso , Mont Blanc , Gran Paradiso , Monte Rosa and the Turin hills. A view to take your breath away.');";
*/const testFactoryAddRef = (name, IDHike, IDPoint, status, message) => {
	return it(name, done => {
		agent
			.post(APIAddRef)
			.send({ IDHike, IDPoint })
			.then(res => {
				// console.log(res.body);
				res.should.have.status(status);
				res.text.should.include(message);
				done();
			})
			.catch(done);
	});
};

'/api/hikes/:hikeId/startPoint'

'/api/hikes/:hikeId/endPoint'

const testFactoryUpdStr = (name, IDHike, StartPoint, status, message) => {
	return it(name, done => {
		agent.post(loginRef).send(loginUser).then(res=>{
			agent
			.post('/api/hikes/'+IDHike+'/startPoint')
			.send({ pointId:StartPoint })
			.then(res => {
				/*console.log("Res status is",res.status,"While expected status is",status);
				console.log("response is ",res.text,"while expected is",message);*/
				res.should.have.status(status);
				res.text.should.include(message);
				done();
			})
			.catch(done);
		})
	});
};

const testFactoryUpdEnd = (name, IDHike, EndPoint, status, message) => {
	return it(name, done => {
		agent.post(loginRef).send(loginUser).then(res=>{
			agent
			.post('/api/hikes/'+IDHike+'/endPoint')
			.send({ pointId:EndPoint })
			.then(res => {
				/*console.log("Res status is",res.status,"While expected status is",status);
				console.log("response is ",res.text,"while expected is",message);*/
				res.should.have.status(status);
				res.text.should.include(message);
				done();
			})
			.catch(done);
		})
	});
};

describe("API Test: Link Points To Hikes", () => {
	/*beforeEach(() => {
		db.serialize(() => {
			db.exec("PRAGMA foreign_keys = 'ON'");
			db.exec(initQueries);
		});
	});
	after(() => {
		db.exec(initQueries);
	});*/
	describe("Link huts to hikes", () => {
		testFactoryAddRef("Normal Call", 1, 2, "201", "");
		testFactoryAddRef("Non-existent Hikes", Number.MAX_VALUE, 2, "404", "hike not found");
		testFactoryAddRef("Non-existent Point", 2, Number.MAX_VALUE, "404", "point not found");
		testFactoryAddRef("Non-numerical Hikes", "Number.MAX_VALUE", 2, "404", "hike not found");
		testFactoryAddRef("Non-numerical Point", 2, "Number.MAX_VALUE", "404", "point not found");
	});

	describe("Link parkings to hikes", () => {
		testFactoryAddRef("Normal Call", 1, 3, "201", "");
		testFactoryAddRef("Non-existent Hikes", Number.MAX_VALUE, 3, "404", "hike not found");
		testFactoryAddRef("Non-existent Point", 1, Number.MAX_VALUE, "404", "point not found");
		testFactoryAddRef("Non-numerical Hikes", "Number.MAX_VALUE", 3, "404", "hike not found");
		testFactoryAddRef("Non-numerical Point", 1, "Number.MAX_VALUE", "404", "point not found");
	});
});

describe("API Test: Update Start/End Points", () => {
	describe("Update Start Points", () => {
		testFactoryUpdStr("Normal Call", 1, 9, "422", "");
		// testFactoryUpdStrEnd("Non-existent Hikes", Number.MAX_VALUE, 1, undefined, "404", "Hike");
		testFactoryUpdStr("Non-existent Start Point", 1, Number.MAX_VALUE, "422", "not linkable");
		// testFactoryUpdStrEnd("Non-numerical Hikes", "Number.MAX_VALUE", 1, undefined, "404", "Hike");
		testFactoryUpdStr("Non-numerical Start Point", 2, "Number.MAX_VALUE", "422", "Bad parameters");
	});
	describe("Update End Points", () => {
		testFactoryUpdEnd("Normal Call", 1, 9, "422", "");
		// testFactoryUpdStrEnd("Non-existent Hikes", Number.MAX_VALUE, undefined, 1, "404", "Hike");
		testFactoryUpdEnd("Non-existent End Point", 1, Number.MAX_VALUE, "422", "linkable");
		// testFactoryUpdStrEnd("Non-numerical Hikes", "Number.MAX_VALUE", undefined, 1, "404", "Hike");
		testFactoryUpdEnd("Non-numerical End Point", 2, "Number.MAX_VALUE", "422", "Bad parameters");
	});
});
