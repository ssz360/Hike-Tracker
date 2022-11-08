const userDao = require("./dao/user-dao");

exports.register = async (req, res) => {
	// ---
	// Validation Here
	// ---
	try {
		// 409 Conflict if username duplicates
		// 200 on Successful registration
		// 500 on general DB/API errors and sends it back
		return await userDao
			.register(req.body.username, req.body.type, req.body.password)
			.then(
				ret => {
					if (ret) return res.status(200).end();
					else return res.status(409).end();
				},
				err => {
					throw err;
				}
			);
	} catch (err) {
		throw err;
		return res.status(500).json(err);
	}
};
