const crypto = require("crypto");
const nodemailer = require("nodemailer");
const DAOUsers = require("../dao/user-dao");
const DAOTokens = require("../dao/tokens");

const sendEmail = async (email, token) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: "hiketracker.se2.15@gmail.com",
				pass: "csxwhxnqehiwiwqt"
			}
		});
		const text = "http://localhost:3001/api/verify/" + token;
		await transporter.sendMail({
			from: "hiketracker.se2.15@gmail.com",
			to: email,
			subject: "HikeTracker -- Email Verification",
			text: text
		});
		return true;
	} catch (err) {
		throw { status: 500, message: err };
	}
};

exports.newVerification = async email => {
	try {
		let token = await DAOTokens.getTokenByEmail(email).then(token => token);
		if (!token) {
			token = crypto.randomBytes(32).toString("hex");
			await DAOTokens.insertNewToken(email, token);
		}
		sendEmail(email, token).then(
			() => {
				return true;
			},
			err => {
				throw err;
			}
		);
	} catch (err) {
		return false;
	}
};

exports.resendVerification = async (req, res) => {
	try {
		const email = req.body.username;
		let token = await DAOTokens.getTokenByEmail(email);
		sendEmail(email, token).then(
			() => {
				res.status(200).end();
			},
			err => {
				throw err;
			}
		);
	} catch (err) {
		res.status(500).send("Error when trying sending new mail");
	}
};

exports.verify = async (req, res) => {
	try {
		const addr = await DAOTokens.getEmailByToken(req.params.token);
		if (addr) {
			DAOTokens.deleteToken(addr).catch(err => {
				throw err;
			});
			DAOUsers.verifyUser(addr).then(
				() => {
					res.status(200).send(
						'Email verification succeeded, you are now verified as a hiker. <a href="http://localhost:3000/login">Login</a>'
					);
				},
				err => {
					throw err;
				}
			);
		} else {
			res.status(404).send("Verification code mismatched or expired, please request registration again.");
		}
	} catch (err) {
		res.status(err.status).send(err.message);
	}
};
