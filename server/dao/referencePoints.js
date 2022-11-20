"use strict";

const db = require("./dao");

exports.getReferencesPoints = IDHike => {
	return new Promise((resolve, reject) => {
		const query = "SELECT * FROM REFERENCE_POINTS WHERE IDHike = ?";
		db.all(query, [IDHike], function (err, rows) {
			if (err) reject(err);
			else resolve(rows.IDPoint);
		});
	});
};

exports.createReferencePoint = (IDPoint, IDHike) => {
	return new Promise((resolve, reject) => {
		const query = "INSERT INTO REFERENCE_POINTS(IDPoint, IDHike) VALUES(?, ?)";
		db.run(query, [IDPoint, IDHike], function (err) {
			if (err) reject(err);
			else resolve(this.lastID);
		});
	});
};
