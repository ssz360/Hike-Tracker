"use strict";
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const userDao = require("./dao/user-dao");
const tokensDao = require("./dao/tokens");

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
		throw err;
	}
};

exports.newVerification = async (req, res) => {
	try {
		const email = req.body.username;
		let token = await tokensDao.getTokenByEmail(email);
		if (!token) {
			token = crypto.randomBytes(32).toString("hex");
			await tokensDao.insertNewToken(email, token);
		}
		await sendEmail(email, token);
		return res.status(200).end();
	} catch (err) {
		return res.status(500).send("Error when trying sending new mail");
	}
};

exports.verify = async (req, res) => {
	try {
		const addr = await tokensDao.getEmailByToken(req.params.token);
		if (addr) {
			await tokensDao.deleteToken(addr).catch(err => {
				throw err;
			});
			await userDao.verifyUser(addr).then(() => {
				return res.status(200).send("Email verification successful.");
			});
		} else {
			return res.status(404).send("Verification code mismatched or expired, please request registration again.");
		}
	} catch (err) {
		return res.status(500).send("Error in verifying");
	}
};
