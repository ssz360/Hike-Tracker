const db = require("./dao");

exports.getTokenByEmail = email => {
	return new Promise((resolve, reject) => {
		const query = "SELECT Token FROM TOKENS WHERE Email = ?;";
		db.get(query, [email], function (err, row) {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else {
				if (row) resolve(row.token);
				else resolve(false);
			}
		});
	});
};

exports.getEmailByToken = token => {
	return new Promise((resolve, reject) => {
		const query = "SELECT Email FROM TOKENS WHERE Token = ?;";
		db.get(query, [token], function (err, row) {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else {
				if (row) resolve(row.email);
				else resolve(false);
			}
		});
	});
};

exports.insertNewToken = (email, token) => {
	return new Promise((resolve, reject) => {
		const query = "INSERT INTO TOKENS(Email, Token) VALUES (?, ?);";
		db.run(query, [email, token], function (err) {
			if (err) {
				// If duplicate (multiple verification attempts) resolves false
				if (err.toString().includes("UNIQUE")) resolve(false);
				else {
					reject({ status: 500, message: err.toString() });
					return;
				}
			} else resolve(true);
		});
	});
};

exports.deleteToken = email => {
	return new Promise((resolve, reject) => {
		const query = "DELETE FROM TOKENS WHERE Email = ?;";
		db.run(query, [email], function (err) {
			if (err) {
				reject({ status: 500, message: err.toString() });
				return;
			} else resolve(true);
		});
	});
};
