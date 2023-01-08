const crypto = require("crypto");
const db = require("./dao");

exports.verifyUser = async username => {
	return new Promise((resolve, reject) => {
		const query = "UPDATE USERS SET Type = 'hiker' WHERE Username = ?";
		db.run(query, [username], function (err) {
			if (err) reject(err);
			else resolve(true);
		});
	});
};

exports.register = async reqBody => {
	const username = reqBody.username;
	const password = reqBody.password;
	const first = reqBody.first_name ?? "";
	const last = reqBody.last_name ?? "";
	const phone = reqBody.phone ?? "";
	return new Promise((resolve, reject) => {
		const query =
			"INSERT INTO USERS (Username, Type, Password, Salt, Name, Surname, PhoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?);";
		// Generating a hashed password
		const salt = crypto.randomBytes(16);
		const hashedPassword = crypto.scryptSync(password, salt, 32);
		// By default the user type is assigned to "user"
		// The right to modify user types should be reserved to administrators
		// Which will be implemented in the future
		db.run(
			query,
			[username, "unverified", hashedPassword.toString("hex"), salt.toString("hex"), first, last, phone],
			function (err) {
				if (err) {
					// If the error is due to unique constraint, it means duplicate
					if (err.toString().includes("UNIQUE")) resolve(false);
					else reject(err);
				} else resolve(true);
			}
		);
	});
};

exports.login = async (username, password) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM USERS WHERE Username=?";
		db.get(sql, [username], (err, row) => {
			if (err) reject(err);
			else {
				if (row !== undefined) {
					crypto.scrypt(password, Buffer.from(row.Salt, "hex"), 32, (err, hashedPassword) => {
						if (err) reject(err);
						else {
							if (!crypto.timingSafeEqual(Buffer.from(row.Password, "hex"), hashedPassword))
								resolve(false);
							else
								resolve({
									username: row.Username,
									type: row.Type,
									name: row.Name,
									surname: row.Surname,
									phonenumber: row.PhoneNumber
								});
						}
					});
				} else resolve(false);
			}
		});
	});
};
