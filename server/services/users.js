const DAOUsers = require("../dao/user-dao");
const DAOTokens = require("./tokens");

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
		DAOTokens.newVerification(req.body.username);
		DAOUsers.register(req.body).then(
			ret => {
				if (ret) {
					DAOUsers.login(req.body.username, req.body.password).then(
						usr => res.status(200).json(usr),
						err => {
							throw err;
						}
					);
				} else res.status(409).end();
			},
			err => {
				throw err;
			}
		);
	} catch (err) {
		return res.status(err.status).json(err.message);
	}
};

// req.Body {
// 	username,
// 	password
// }
exports.login = DAOUsers.login;
