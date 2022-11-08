const crypto = require("crypto");
const db = require("./dao");

exports.register = async (username, type, password) => {
	return new Promise(async (resolve, reject) => {
		const query =
			"INSERT INTO USERS (Username, Type, Password, Salt) VALUES (?, ?, ?, ?);";
		// Generating a hashed password
		const salt = crypto.randomBytes(16).toString("hex");
		const hashedPassword = crypto
			.scryptSync(password, salt, 32)
			.toString("hex");
		// The user is defined as user by default
		// The right of modifications to user types should be reserved to administrators
		db.run(query, [username, type, hashedPassword, salt], function (err) {
			if (err) {
				// If the error is due to unique constraint
				// It means duplicate
				if (err.toString().includes("UNIQUE")) resolve(false);
				else reject(err);
			} else resolve(true);
		});
	});
};

exports.login = async (username, password) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM USERS WHERE Username=?";
		db.get(sql, [username], (err, row) => {
			if (err) reject(err);
			else {
				if (row !== undefined) {
					crypto.scrypt(
						password,
						Buffer.from(row.Salt, "hex"),
						32,
						(err, hashedPassword) => {
							if (err) reject(err);
							else {
								if (
									!crypto.timingSafeEqual(
										Buffer.from(row.Password, "hex"),
										hashedPassword
									)
								)
									resolve(false);
								else
									resolve({
										username: row.Username,
										type: row.Type
									});
							}
						}
					);
				} else resolve(false);
			}
		});
	});
};
