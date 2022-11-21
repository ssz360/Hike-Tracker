"use strict";
// const DAOHikes = require("./dao/hikes");
const DAOPoints = require("./dao/points");
const DAORefs = require("./dao/referencePoints");

// req.body {
//     IDHike,
//     coordinates,
// }

export async function addReferencePoint(req, res) {
	// const reqPoint = await DAOPoints.insertPoint(
	//  IDHike,
	// 	"ref-" + req.body.IDHike + String.from(Math.random() * 100),
	// 	req.body.coordinates,
	// 	"Reference"
	// );
	try {
		const reqPoint = await DAOPoints.insertPoint(
			"ref-" + req.body.IDHike + String.from(Math.random() * 100),
			req.body.coordinates,
			"Italy",
			"Reference"
		).catch(err => {
			throw err;
		});
		return new Promise(async (resolve, reject) => {
			return await DAORefs.createReferencePoint(reqPoint, IDHike).then(
				id => {
					return res.status(200).json(id);
				},
				err => {
					throw err;
				}
			);
		});
	} catch (err) {
		return res.status(500).send(err);
	}
}
