"use strict";

const db = require("./dao");

exports.getReferencesPoints = IDHike => {
	return new Promise((resolve, reject) => {
		const query = "SELECT * FROM LINKEDPOINTS WHERE IDHike = ?";
		db.all(query, [IDHike], function (err, rows) {
			if (err) reject({ status: 500, message: err.toString() });
			else
				resolve(
					rows.map(row => {
						return row;
					})
				);
		});
	});
};

exports.createReferencePoint = (IDPoint, IDHike) => {
	return new Promise((resolve, reject) => {
		const query = "INSERT INTO LINKEDPOINTS(IDPoint, IDHike) VALUES (?, ?)";
		db.run(query, [IDPoint, IDHike], function (err) {
			if (err) reject({ status: 500, message: err.toString() });
			else resolve(this.lastID);
		});
	});
};

exports.deleteReferencePoint = (IDPoint, IDHike) => {
	return new Promise((resolve, reject) => {
		const query =
			"DELETE FROM LINKEDPOINTS WHERE IDPoint = ? AND IDHike = ?";
		db.run(query, [IDPoint, IDHike], function (err) {
			if (err) reject({ status: 500, message: err.toString() });
			else {
				if (this.changes === 0)
					reject({
						status: 404,
						message: "Reference point not found."
					});
				else resolve(this.changes);
			}
		});
	});
};
