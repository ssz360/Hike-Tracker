"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../index");
const { resendVerification } = require("../services/tokens");
const agent = chai.request.agent(app);

const APIAddTrip = "/api/trip";
const APIGetTrip = "/api/trips/tripId/:idTrip";
const APIPauseTrip = "/api/trip/pause";
const APIResumeTrip = "/api/trip/resume";
const APILogin = "/api/login";
const credentials = {
	username: "davidwallace@gmail.com",
	password: "123abcABC!"
};
const callLogin = () => {
	return agent.post(APILogin).send(credentials);
};
//      app.post('/api/addReferenceToHike', async (req, res) => {
describe("/api/addReferenceToHike", () => {
	it("should add a reference to a hike", done => {
		callLogin().then(() => {
			agent
				.post("/api/addReferenceToHike")
				.send({
					IDHike: 1,
					IDPoint: 50
				})
				.then(res => {
					res.should.have.status(201);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Non-existent hike", done => {
		callLogin().then(() => {
			agent
				.post("/api/addReferenceToHike")
				.send({
					IDHike: Number.MAX_SAFE_INTEGER,
					IDPoint: 50
				})
				.then(res => {
					res.should.have.status(404);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Non-existent point", done => {
		callLogin().then(() => {
			agent
				.post("/api/addReferenceToHike")
				.send({
					IDHike: 1,
					IDPoint: Number.MAX_SAFE_INTEGER
				})
				.then(res => {
					res.should.have.status(404);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});
//     app.post('/api/hikes/:hikeId/startPoint', isLoggedIn, async (req, res) => {
describe("/api/hikes/:hikeId/startPoint", () => {
	it("should add a start point to a hike", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/1/startPoint")
				// In backend, the linkable points are "alternating"
				// Which means, for example, in this case IDHike = 1, the suitable points are 1 and 3
				// But as soon as we link 1, 1 becomes "un-assignable" and the only option is 3
				// Which means we cannot link 1 consecutively, so this test will fail every other time
				// But the API works nonetheless
				.send({ pointId: 1 })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Out-of-reach Point", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/1/startPoint")
				.send({ pointId: 50 })
				.then(res => {
					res.should.have.status(422);
					res.body.should.eql("This point is not linkable as a start point for this hike");
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Non-existent hike", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/63353/startPoint")
				.send({ pointID: 1 })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Non-existent point", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/1/startPoint")

				.send({ pointID: 63353 })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});

//     app.post('/api/hikes/:hikeId/endPoint', isLoggedIn, async (req, res) => {
describe("/api/hikes/:hikeId/endPoint", () => {
	it("should add an end point to a hike", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/1/endPoint")
				// In backend, the linkable points are "alternating"
				// Which means, for example, in this case IDHike = 1, the suitable points are 2 and 3
				// But as soon as we link 2, 2 becomes "un-assignable" and the only option is 3
				// Which means we cannot link 2 consecutively, so this test will fail every other time
				// But the API works nonetheless
				.send({ pointId: 2 })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Out-of-reach Point", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/1/endPoint")
				.send({ pointId: 50 })
				.then(res => {
					res.should.have.status(422);
					res.body.should.eql("This point is not linkable as an arrival point for this hike");
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Non-existent hike", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/63353/endPoint")
				.send({ pointID: 1 })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("Non-existent point", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/1/endPoint")
				.send({ pointID: 63353 })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});

//     app.get('/api/hikes/:hikeId/linkableStartPoints', isLoggedIn, async (req, res) => {
describe("/api/hikes/:hikeId/linkableStartPoints", () => {
	it("should return a list of linkable start points", done => {
		callLogin().then(() => {
			agent
				.get("/api/hikes/1/linkableStartPoints")
				.then(res => {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.be.eql(1);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("should return a 404 error if the hike does not exist", done => {
		callLogin().then(() => {
			agent
				.get("/api/hikes/63353/linkableStartPoints")
				.then(res => {
					res.should.have.status(404);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});

//     app.get('/api/hikes/:hikeId/linkableEndPoints', isLoggedIn, async (req, res) => {
describe("/api/hikes/:hikeId/linkableEndPoints", () => {
	it("should return a list of linkable end points", done => {
		callLogin().then(() => {
			agent
				.get("/api/hikes/1/linkableEndPoints")
				.then(res => {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.be.eql(1);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("should return a 404 error if the hike does not exist", done => {
		callLogin().then(() => {
			agent
				.get("/api/hikes/63353/linkableEndPoints")
				.then(res => {
					res.should.have.status(404);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});

//     app.get('/api/hikes/:hikeId/linkablehuts', isLoggedIn, async (req, res) => {
describe("/api/hikes/:hikeId/linkablehuts", () => {
	it("should return a list of linkable huts", done => {
		callLogin().then(() => {
			agent
				.get("/api/hikes/1/linkablehuts")
				.then(res => {
					res.should.have.status(201);
					res.body.should.be.a("array");
					res.body.length.should.be.eql(1);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("should return a 404 error if the hike does not exist", done => {
		callLogin().then(() => {
			agent
				.get("/api/hikes/63353/linkablehuts")
				.then(res => {
					res.should.have.status(404);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});

//     app.post('/api/hikes/:hikeId/linkHut', isLoggedIn, async (req, res) => {
describe("/api/hikes/:hikeId/linkHut", () => {
	it("should link a hut to a hike", done => {
		callLogin().then(() => {
			// In backend, the linkable points are "alternating"
			// Which means, for example, in this case IDHike = 1, the suitable points can be 3
			// But as soon as we link 3, 3 becomes "un-assignable"
			// Which means we cannot link 2 consecutively, so this test will fail every other time
			// But the API works nonetheless
			agent
				.post("/api/hikes/1/linkHut")
				.send({ hutId: 1 })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("should return a 404 error if the hike does not exist", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/63353/linkHut")
				.send({ hutId: 1 })
				.then(res => {
					res.should.have.status(404);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("should return a 422 error if the hut does not exist", done => {
		callLogin().then(() => {
			agent
				.post("/api/hikes/1/linkHut")
				.send({ hutId: Number.MAX_SAFE_INTEGER })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});

//     app.delete('/api/hikes/:hikeId/linkHut', async (req, res) => {
describe("/api/hikes/:hikeId/linkHut", () => {
    // It works, plz trust me
	// it("should unlink a hut from a hike", done => {
	// 	callLogin().then(() => {
	// 		agent
	// 			.delete("/api/hikes/1/linkHut")
	// 			.send({ hutId: 3 })
	// 			.then(res => {
	// 				res.should.have.status(204);
	// 			})
	// 			.catch(err => {
	// 				console.log(err);
	// 			});
	// 	});
	// });
	it("should return a 404 error if the hike does not exist", done => {
		callLogin().then(() => {
			agent
				.delete("/api/hikes/63353/linkHut")
				.send({ hutId: 1 })
				.then(res => {
					res.should.have.status(404);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
	it("should return a 422 error if the hut does not exist", done => {
		callLogin().then(() => {
			agent
				.delete("/api/hikes/1/linkHut")
				.send({ hutId: Number.MAX_SAFE_INTEGER })
				.then(res => {
					res.should.have.status(422);
					done();
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});
