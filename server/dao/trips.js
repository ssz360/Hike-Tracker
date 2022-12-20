const db = require("../dao/dao");

// Functions
// addTrip(IDHike, IDUser, start_time, ID_last_ref)
// getTrip(IDTrip)
// getTripsByStatus(status)
// getTripsByUserAndStatus(IDUser, status)
// getTripsByHikeAndUser(IDHike, IDUser)
// getTripsByHikeAndUserAndStatus(IDHike, IDUser, status)
// terminateTrip(IDTrip, end_time, ID_end_point)
// updateTripStatus(IDTrip, status)
// updateTripLastReference(IDTrip, ID_last_ref)
// updateTrip(IDTrip, IDHike, IDUser, start_time, end_time, ID_last_ref, status)
// deleteTrip(IDTrip)
// deleteTripsByHike(IDHike)
// deleteTripsByUser(IDUser)

exports.addTrip = (IDHike, IDUser, start_time, ID_start_point) => {
	const sql = "INSERT INTO TRIPS(IDHike,IDUser,start_time,ID_last_ref,status) VALUES(?,?,dateTime(?),?,?)";
	const params = [IDHike, IDUser, start_time, ID_start_point, "Ongoing"];
	return new Promise((resolve, reject) => {
		db.run(sql, params, function (err) {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.getTrip = IDTrip => {
	const sql = "SELECT * FROM TRIPS WHERE IDTrip = ?";
	return new Promise((resolve, reject) => {
		db.get(sql, [IDTrip], (err, row) => {
			if (err) {
				reject({ status: 500, message: "Error getting trip" });
				return;
			} else resolve(row);
		});
	});
};

exports.terminateTrip = (IDTrip, end_time, ID_end_point) => {
	const sql = "UPDATE TRIPS SET status = ?,end_time = dateTime(?),ID_end_point = ? WHERE IDTrip = ?";
	const params = ["terminated", end_time, ID_end_point, IDTrip];
	return new Promise((resolve, reject) => {
		db.run(sql, params, function (err) {
			if (err) {
				reject({ status: 500, message: "Error terminating trip" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.updateTripStatus = (IDTrip, status) => {
	const sql = "UPDATE TRIPS SET status = ? WHERE IDTrip = ?";
	return new Promise((resolve, reject) => {
		db.run(sql, [status, IDTrip], function (err) {
			if (err) {
				reject({ status: 500, message: "Error updating trip status" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.updateLastReference = (IDTrip, ID_last_ref) => {
	const sql = "UPDATE TRIPS SET ID_last_ref = ? WHERE IDTrip = ?";
	return new Promise((resolve, reject) => {
		db.run(sql, [ID_last_ref, IDTrip], function (err) {
			if (err) {
				reject({ status: 500, message: "Error updating trip last reference" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.updateTrip = (IDTrip, IDHike, IDUser, start_time, end_time, ID_last_ref, status) => {
	const sql =
		"UPDATE TRIPS SET IDHike = ?,IDUser = ?,start_time = dateTime(?),end_time = dateTime(?),ID_last_ref = ?,status = ? WHERE IDTrip = ?";
	const params = [IDHike, IDUser, start_time, end_time, ID_last_ref, status, IDTrip];
	return new Promise((resolve, reject) => {
		db.run(sql, params, function (err) {
			if (err) {
				reject({ status: 500, message: "Error updating trip" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.deleteTrip = IDTrip => {
	const sql = "DELETE FROM TRIPS WHERE IDTrip = ?";
	return new Promise((resolve, reject) => {
		db.run(sql, [IDTrip], function (err) {
			if (err) {
				reject({ status: 500, message: "Error deleting trip" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.deleteTripsByUser = IDUser => {
	const sql = "DELETE FROM TRIPS WHERE IDUser = ?";
	return new Promise((resolve, reject) => {
		db.run(sql, [IDUser], function (err) {
			if (err) {
				reject({ status: 500, message: "Error deleting trips" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.deleteTripsByHike = IDHike => {
	const sql = "DELETE FROM TRIPS WHERE IDHike = ?";
	return new Promise((resolve, reject) => {
		db.run(sql, [IDHike], function (err) {
			if (err) {
				reject({ status: 500, message: "Error deleting trips" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.getTripsByHike = IDHike => {
	const sql = "SELECT * FROM TRIPS WHERE IDHike = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDHike], (err, rows) => {
			if (err) {
				reject({ status: 500, message: "Error getting trips" });
				return;
			} else resolve(rows);
		});
	});
};

exports.getTripsByUser = IDUser => {
	const sql = "SELECT * FROM TRIPS WHERE IDUser = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDUser], (err, rows) => {
			if (err) {
				reject({ status: 500, message: "Error getting trips" });
				return;
			} else resolve(rows);
		});
	});
};

exports.getTripsByStatus = status => {
	const sql = "SELECT * FROM TRIPS WHERE status = ?";
	return new Promise((resolve, reject) => {
		db.run(sql, [status], function (err) {
			if (err) {
				reject({ status: 500, message: "Error getting trips" });
				return;
			} else resolve(this.lastID);
		});
	});
};

exports.getTripsByHikeAndUser = (IDHike, IDUser) => {
	const sql = "SELECT * FROM TRIPS WHERE IDHike = ? AND IDUser = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDHike, IDUser], (err, rows) => {
			if (err) {
				reject({ status: 500, message: "Error getting trips" });
				return;
			} else resolve(rows);
		});
	});
};

exports.getTripsByHikeAndStatus = (IDHike, status) => {
	const sql = "SELECT * FROM TRIPS WHERE IDHike = ? AND status = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDHike, status], (err, rows) => {
			if (err) {
				reject({ status: 500, message: "Error getting trips" });
				return;
			} else resolve(rows);
		});
	});
};

exports.getTripsByUserAndStatus = (IDUser, status) => {
	const sql = "SELECT * FROM TRIPS WHERE IDUser = ? AND status = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDUser, status], (err, rows) => {
			if (err) {
				reject({ status: 500, message: "Error getting trips" });
				return;
			} else resolve(rows);
		});
	});
};

exports.getTripsByHikeAndUserAndStatus = (IDHike, IDUser, status) => {
	const sql = "SELECT * FROM TRIPS WHERE IDHike = ? AND IDUser = ? AND status = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDHike, IDUser, status], (err, rows) => {
			if (err) {
				reject({ status: 500, message: "Error getting trips" });
				return;
			} else resolve(rows);
		});
	});
};
