const db = require('./dao');

getParkingsList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES'
    db.all(sql, [], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const hikes = row.map((p) => ({ IDPoint: p.IDPoint, Name: p.Name, Coordinates: [p.Latitude,p.Longitude], GeographicalArea: p.GeographicalArea }))
        resolve(hikes);
    });
});

function insertPoint(name, latitude, longitude, GeographicalArea, TypeOfPoint) {
    return new Promise((res, rej) => {
        console.log("In insert point with",name,latitude,longitude,GeographicalArea,TypeOfPoint)
        if (!name || !latitude || !longitude || !GeographicalArea || !TypeOfPoint) {
            rej("All of the 'name, coordinates, GeographicalArea, TypeOfPoint' are required.");
            return;
        }

        let query = `INSERT INTO POINTS (name, Latitude, Longitude, GeographicalArea, TypeOfPoint) VALUES(?,?,?,?,?);`;

        db.run(query, [name, latitude, longitude, GeographicalArea, TypeOfPoint], function (err) {
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

const getPointsInBounds= async (minLat,maxLat,minLon,maxLon,startLat,startLon,endLat,endLon) =>new Promise((resolve, reject) => {
    let sql = "SELECT * FROM POINTS WHERE Latitude>=? AND Latitude<=? AND Longitude>=? AND Longitude<=? AND NOT((Latitude=? AND Longitude=?) OR (Latitude=? AND Longitude=?))";
    db.all(sql, [minLat,maxLat,minLon,maxLon,startLat,startLon,endLat,endLon], (err, rows) => {
        if (err)    reject({status:503,message:"Internal error"});
        resolve(rows.map(p=>({id: p.IDPoint, name: p.Name, coordinates: [p.Latitude,p.Longitude], geographicalArea: p.GeographicalArea, typeOfPoint: p.TypeOfPoint})));
    })
});

const hutsInBounds= async (minLat,maxLat,minLon,maxLon,startLat,startLon,endLat,endLon) =>new Promise((resolve, reject) => {
    let sql = "SELECT * FROM POINTS WHERE TypeOfPoint='Hut' AND Latitude>=? AND Latitude<=? AND Longitude>=? AND Longitude<=? AND NOT((Latitude=? AND Longitude=?) OR (Latitude=? AND Longitude=?))";
    db.all(sql, [minLat,maxLat,minLon,maxLon,startLat,startLon,endLat,endLon], (err, rows) => {
        if (err)    reject({status:503,message:"Internal error"});
        resolve(rows.map(p=>({id: p.IDPoint, name: p.Name, coordinates: [p.Latitude,p.Longitude], geographicalArea: p.GeographicalArea, typeOfPoint: p.TypeOfPoint})));
    })
});


const points = { getParkingsList, insertPoint, getPointById, getPointsInBounds, hutsInBounds }
module.exports = points;
















