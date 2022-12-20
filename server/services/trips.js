const DAOTrips = require("../dao/trips");

// req.user.username
exports.getTripsByUser = (req, res) => {
	DAOTrips.getTripsByUser(req.user.username)
		.then(trips => res.status(200).json(trips))
		.catch(err => res.status(err.status).send(err.message));
};

// req.params.idHike
exports.getTripsByHike = (req, res) => {
	DAOTrips.getTripsByHike(req.params.idHike)
		.then(trips => res.status(200).json(trips))
		.catch(err => res.status(err.status).send(err.message));
};

// req.params.idTrip
exports.getTripById = (req, res) => {
	DAOTrips.getTrip(req.params.idTrip)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.params.status
exports.getTripByStatus = (req, res) => {
	DAOTrips.getTripsByStatus(req.params.status)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.user.username, req.params.idHike
exports.getTripsByHikeAndUser = (req, res) => {
	DAOTrips.getTripsByHikeAndUser(req.params.idHike, req.user.username)
		.then(trips => res.status(200).json(trips))
		.catch(err => res.status(err.status).send(err.message));
};

// req.user.username, req.params.status
exports.getTripsByUserAndStatus = (req, res) => {
	DAOTrips.getTripsByUserAndStatus(req.user.username, req.params.status)
		.then(trips => res.status(200).json(trips))
		.catch(err => res.status(err.status).send(err.message));
};

// getTripsByUserAndHikeAndStatus(IDUser, IDHike, status)
exports.getTripsByHikeAndUserAndStatus = (req, res) => {
	DAOTrips.getTripsByHikeAndUserAndStatus(req.params.idHike, req.user.username, req.params.status)
		.then(trips => res.status(200).json(trips))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body => { IDHike, start_time, ID_start_point }
exports.addTrip = (req, res) => {
	DAOTrips.addTrip(req.body.IDHike, req.user.username, req.body.start_time, req.body.ID_start_point)
		.then(trip => res.status(201).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body.idTrip, req.body.status
exports.updateTripStatus = (req, res) => {
	DAOTrips.updateTripStatus(req.body.idTrip, req.body.status)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body.idTrip
exports.terminateTrip = (req, res) => {
	DAOTrips.terminateTrip(req.body.idTrip, req.body.endTime, req.body.ID_end_point ?? null)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body => { IDHike, IDUser, IDTrip, start_time, end_time, ID_last_ref, status }
exports.updateTrip = (req, res) => {
	DAOTrips.updateTrip(req.body)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body.idTrip
exports.deleteTrip = (req, res) => {
	DAOTrips.deleteTrip(req.body.idTrip)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.user.username
exports.deleteTripsByUser = (req, res) => {
	DAOTrips.deleteTripsByUser(req.user.username)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};

// req.body.idHike
exports.deleteTripsByHike = (req, res) => {
	DAOTrips.deleteTripsByHike(req.body.idHike)
		.then(trip => res.status(200).json(trip))
		.catch(err => res.status(err.status).send(err.message));
};
