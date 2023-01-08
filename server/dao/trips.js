const db = require("../dao/dao");

exports.addTrip = (IDHike, startTime, IDUser, ID_start_point) => {
	const sql =
		"INSERT INTO TRIPS(IDHike,IDUser,start_time,ID_last_ref,last_seg_duration,last_seg_end_time,status) VALUES(?,?,?,?,?,?,?)";
	const params = [
		IDHike,
		IDUser,
		startTime,
		ID_start_point,
		0,
		startTime,
		"Ongoing"
	];
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
				reject({ status: 500, message: err.toString() });
				return;
			} else resolve(row);
		});
	});
};

exports.getCurrentTrip = IDUser => {
	const sql =
		"SELECT * FROM TRIPS WHERE IDUser = ? AND (status = ? OR status = ?);";
	return new Promise((resolve, reject) => {
		db.get(sql, [IDUser, "Ongoing", "Paused"], (err, row) => {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else
				resolve(
					row
						? {
								IDTrip: row.IDTrip,
								hikeId: row.IDHike,
								start: row.start_time,
								stoppedAt: row.last_seg_end_time,
								stopped: row.status === "Paused",
								secsFromLastStop: row.last_seg_duration
						  }
						: null
				);
		});
	});
};

exports.getAllTripsByUser = IDUser => {
	const sql = "SELECT * FROM TRIPS WHERE IDUser = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDUser], (err, rows) => {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else resolve(rows);
		});
	});
};

exports.getAllTripsByHike = IDHike => {
	const sql = "SELECT * FROM TRIPS WHERE IDHike = ?";
	return new Promise((resolve, reject) => {
		db.all(sql, [IDHike], (err, rows) => {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else resolve(rows);
		});
	});
};

exports.pauseTrip = (IDTrip, lastSegDuration, lastSegEndTime) => {
	const sql =
		"UPDATE TRIPS SET status = ?, last_seg_duration = ?, last_seg_end_time = ? WHERE IDTrip = ?";
	return new Promise((resolve, reject) => {
		db.run(
			sql,
			["Paused", lastSegDuration, lastSegEndTime, IDTrip],
			function (err) {
				if (err) {
					reject({ status: 500, message: err.toString() });
					return;
				} else {
					if (this.changes === 0) {
						reject({ status: 404, message: "Trip not found" });
						return;
					} else resolve(this.lastID);
				}
			}
		);
	});
};

exports.resumeTrip = (IDTrip, lastSegEndTime) => {
	const sql =
		"UPDATE TRIPS SET status = ?, last_seg_end_time = ? WHERE IDTrip = ?";
	return new Promise((resolve, reject) => {
		db.run(sql, ["Ongoing", lastSegEndTime, IDTrip], function (err) {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else {
				if (this.changes === 0) {
					reject({ status: 404, message: "Trip not found" });
					return;
				} else resolve(this.lastID);
			}
		});
	});
};

exports.finishTrip = (IDTrip, lastSegDuration, lastSegEndTime,timeEnded) => {
	const sql =
		"UPDATE TRIPS SET status = ?, last_seg_duration = ?, last_seg_end_time = ?, end_time = ? WHERE IDTrip = ?";
	return new Promise((resolve, reject) => {
		db.run(
			sql,
			["Ended", lastSegDuration, lastSegEndTime, timeEnded, IDTrip],
			function (err) {
				if (err) {
					reject({ status: 500, message: err.toString() });
					return;
				} else resolve(this.lastID);
			}
		);
	});
};

// exports.updateLastReference = (IDTrip, ID_last_ref) => {
// 	const sql = "UPDATE TRIPS SET ID_last_ref = ? WHERE IDTrip = ?";
// 	return new Promise((resolve, reject) => {
// 		db.run(sql, [ID_last_ref, IDTrip], function (err) {
// 			if (err) {
// 				reject({ status: 500, message: err.toString() });
// 				return;
// 			} else resolve(this.lastID);
// 		});
// 	});
// };
