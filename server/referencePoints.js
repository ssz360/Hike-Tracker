"use strict";
const DAOPoints = require("./dao/points");
const DAORefs = require("./dao/referencePoints");
const DAOHikes = require("./dao/hikes");

// req.body {
//     IDHike: number,
//     coordinates: String,
// }

exports.addReferencePoint = async (req, res) => {
	try {
		if (!req.body.coordinates.split(",").every(s => /[0-9]/.test(s)))
			return res.status(400).send("Invalid Coordinates");
		if (
			(await DAOHikes.getHike(req.body.IDHike).catch(err => {
				return err;
			})) === 404
		)
			return res.status(404).send("Hike does not exist");
		const reqPoint = await DAOPoints.insertPoint(
			"ref-" +
				req.body.IDHike +
				"-" +
				Math.trunc(req.body.coordinates.split(",")[0]) +
				"-" +
				Math.trunc(req.body.coordinates.split(",")[1]),
				Math.trunc(req.body.coordinates.split(",")[0]),
			Math.trunc(req.body.coordinates.split(",")[1]),
			"Italy",
			"Reference"
		).catch(err => {
			throw err;
		});
		return await DAORefs.createReferencePoint(reqPoint, req.body.IDHike).then(
			id => {
				return res.status(200).json(id);
			},
			err => {
				throw err;
			}
		);
	} catch (err) {
		console.log("Err ",err);
		return res.status(500).send(err);
	}
};
