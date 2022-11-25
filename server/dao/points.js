const db = require('./dao');

getParkingsList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES'
    db.all(sql, [], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const hikes = row.map((p) => ({ IDPoint: p.IDPoint, Name: p.Name, Coordinates: p.Coordinates, GeographicalArea: p.GeographicalArea }))
        resolve(hikes);
    });
});

function getPoints(IDPoint) {
	const sql = "SELECT * FROM Points";
	return new Promise((resolve, reject) => {
		IDPoint
			? db.get(sql + " WHERE IDPoint = ?;", [IDPoint], (err, row) => {
					if (err) {
						reject(err);
						return;
					} else resolve(row);
			  })
			: db.all(sql + ";", [], (err, rows) => {
					if (err) {
						reject(err);
						return;
					}
					const points = rows.map(p => ({
						IDPoint: p.IDPoint,
						Name: p.Name,
						Coordinates: p.Coordinates,
						GeographicalArea: p.GeographicalArea,
						TypeOfPoint: p.TypeOfPoint,
						IDHike: p.IDHike,
						IDHut: p.IDHut,
						IDParking: p.IDParking
					}));
					resolve(points);
			  });
	});
}

function insertPoint(name, coordinates, GeographicalArea, TypeOfPoint) {
    return new Promise((res, rej) => {

        if (!name || !coordinates || !GeographicalArea || !TypeOfPoint) {
            rej("All of the 'name, coordinates, GeographicalArea, TypeOfPoint' are required.");
            return;
        }

        let query = `INSERT INTO POINTS (name, coordinates, GeographicalArea, TypeOfPoint) VALUES(?,?,?,?);`;

        db.run(query, [name, coordinates, GeographicalArea, TypeOfPoint], function (err) {
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
}

const getPointById = (id) => new Promise((resolve, reject) => {
    let sql = "SELECT * FROM POINTS WHERE IDPoint = ?";
    db.get(sql, [id], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(row);
    })
});

const points = { getParkingsList, insertPoint, getPoints, getPointById }
module.exports = points;
















