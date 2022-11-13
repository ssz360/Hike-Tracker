const db = require('./dao');




getHutsList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS P, HUTS H WHERE P.IDPoint = H.IDPoint'
    db.all(sql, [], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const huts = row.map((h) => ({ IDPoint: h.IDPoint, Name: h.Name, Coordinates: h.Coordinates, GeographicalArea: h.GeographicalArea }))
        resolve(huts);
    });
});

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


const points = { getHutsList, getParkingsList, insertPoint }
module.exports = points;
















