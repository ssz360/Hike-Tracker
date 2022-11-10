const userDao = require("./dao/user-dao");
const tokens = require("./tokens");

// req.body {
// 	username,
// 	password,
// 	first_name,
// 	last_name,
// 	phone,
// }
exports.register = async (req, res) => {
	// ---
	// Validation Here
	// ---
	try {
		// 409 Conflict if username duplicates
		// 200 on Successful registration
		// 500 on general DB/API errors and sends it back
		await tokens.newVerification(req, res);
		return await userDao.register(req.body).then(
			ret => {
				if (ret) return res.status(200).end();
				else return res.status(409).end();
			},
			err => {
				throw err;
			}
		);
	} catch (err) {
		return res.status(500).json(err);
	}
};

// req.Body {
// 	username,
// 	password
// }
exports.login = userDao.login;
