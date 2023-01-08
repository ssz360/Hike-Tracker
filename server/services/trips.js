const DAOTrips = require("../dao/trips");
const DAOHikes = require("../dao/hikes");

// req.params.idTrip
exports.getTripById = (req, res) => {
	DAOTrips.getTrip(req.params.idTrip)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

exports.getCurrentTrip = (req, res) => {
	DAOTrips.getCurrentTrip(req.user.username)
		.then(trip => {
			res.status(200).json(trip);
		})
		.catch(err => res.status(err.status).send(err.message));
};

// req.user.username
exports.getTripsByUser = (req, res) => {
	DAOTrips.getAllTripsByUser(req.user.username)
		.then(trips => res.status(200).json(trips))
		.catch(err => res.status(err.status).send(err.message));
};

// req.params.idHike
exports.getTripsByHike = (req, res) => {
	DAOTrips.getAllTripsByHike(req.params.idHike)
		.then(trips => res.status(200).json(trips))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body => { IDHike, startTime }
exports.addTrip = async (req, res) => {
	if (isNaN(Date.parse(req.body.startTime))) {
		res.status(400).send("Invalid date");
		return;
	}
	const curr = await DAOTrips.getCurrentTrip(req.user.username);
	if (curr) {
		res.status(422).send("Impossible starting a new hike: a hike is already going on");
		return;
	}
	const ID_start_point = await DAOHikes.getHike(req.body.IDHike).then(
		hike => hike.startPoint.id
	);
	DAOTrips.addTrip(
		req.body.IDHike,
		req.body.startTime,
		req.user.username,
		ID_start_point
	)
		.then(trip => res.status(200).json(trip))
		.catch(err => {
			res.status(err.status).send(err.message);
		});
};

// req.body.stoppedAt, req.body.secsFromLastStop,
exports.pauseTrip = async (req, res) => {
	if (isNaN(Date.parse(req.body.stoppedAt))) {
		res.status(400).send("Invalid date");
		return;
	}
	const currentTrip = await DAOTrips.getCurrentTrip(req.user.username);
	DAOTrips.pauseTrip(
		currentTrip.IDTrip,
		req.body.secsFromLastStop,
		req.body.stoppedAt
	)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body.stoppedAt
exports.resumeTrip = async (req, res) => {
	if (isNaN(Date.parse(req.body.stoppedAt))) {
		res.status(400).send("Invalid date");
		return;
	}
	const currentTrip = await DAOTrips.getCurrentTrip(req.user.username);
	DAOTrips.resumeTrip(currentTrip.IDTrip, req.body.stoppedAt)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body.secsFromLastStop,
// req.body.stoppedAt,
// req.body.timeEnded
exports.finishTrip = async (req, res) => {
	const currentTrip = await DAOTrips.getCurrentTrip(req.user.username);
	DAOTrips.finishTrip(currentTrip.IDTrip,
		req.body.secsFromLastStop,
		req.body.stoppedAt,
		req.body.timeEnded)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};
