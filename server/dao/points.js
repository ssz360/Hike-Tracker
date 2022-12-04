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

const linkPointToHike=(hikeId,pointId)=>new Promise((resolve,reject)=>{
    const sql="INSERT INTO LINKEDPOINTS(IDPoint,IDHike) VALUES(?,?)";
    db.run(sql,[pointId,hikeId],err=>{
        if(err) reject({status:503,message:err});
        resolve();
    })
})

function insertPoint(name, latitude, longitude, GeographicalArea, TypeOfPoint) {
    return new Promise((res, rej) => {
        console.log("In insert point with name",name,"lat",latitude,"long",longitude,"geoarea",GeographicalArea,"type",TypeOfPoint)
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

const linkableStartPoints= async (startLat,startLon,endLat,endLon) =>new Promise((resolve, reject) => {
    let sql = "SELECT * FROM POINTS WHERE (TypeOfPoint='Hut' OR TypeOfPoint='Parking') AND 2 * 6371 * sqrt(pow(sin((radians(?) - radians(Latitude)) / 2), 2)+ cos(radians(Latitude))* cos(radians(?))* pow(sin((radians(?) - radians(Longitude)) / 2), 2))<=5000 AND NOT((Latitude=? AND Longitude=?) OR (Latitude=? AND Longitude=?))";
    db.all(sql, [startLat,startLat,startLon,startLat,startLon,endLat,endLon], (err, rows) => {
        if (err)    reject({status:503,message:"Internal error"});
        resolve(rows.map(p=>({id: p.IDPoint, name: p.Name, coordinates: [p.Latitude,p.Longitude], geographicalArea: p.GeographicalArea, typeOfPoint: p.TypeOfPoint})));
    })
});

const linkableEndPoints= async (startLat,startLon,endLat,endLon) =>new Promise((resolve, reject) => {
    let sql = "SELECT * FROM POINTS WHERE (TypeOfPoint='Hut' OR TypeOfPoint='Parking') AND 2 * 6371 * sqrt(pow(sin((radians(?) - radians(Latitude)) / 2), 2)+ cos(radians(Latitude))* cos(radians(?))* pow(sin((radians(?) - radians(Longitude)) / 2), 2))<=5000 AND NOT((Latitude=? AND Longitude=?) OR (Latitude=? AND Longitude=?))";
    db.all(sql, [endLat,endLat,endLon,startLat,startLon,endLat,endLon], (err, rows) => {
        if (err)    reject({status:503,message:"Internal error"});
        resolve(rows.map(p=>({id: p.IDPoint, name: p.Name, coordinates: [p.Latitude,p.Longitude], geographicalArea: p.GeographicalArea, typeOfPoint: p.TypeOfPoint})));
    })
});

const linkableHuts= async (lat,lon,startLat,startLon,endLat,endLon) =>new Promise((resolve, reject) => {
    let sql = "SELECT * FROM POINTS WHERE TypeOfPoint='Hut' AND 2 * 6371 * sqrt(pow(sin((radians(?) - radians(Latitude)) / 2), 2)+ cos(radians(Latitude))* cos(radians(?))* pow(sin((radians(?) - radians(Longitude)) / 2), 2))<=5000 AND NOT((Latitude=? AND Longitude=?) OR (Latitude=? AND Longitude=?))";
    db.all(sql, [lat,lat,lon,startLat,startLon,endLat,endLon], (err, rows) => {
        if (err)    reject({status:503,message:"Internal error"});
        resolve(rows.map(p=>({id: p.IDPoint, name: p.Name, coordinates: [p.Latitude,p.Longitude], geographicalArea: p.GeographicalArea, typeOfPoint: p.TypeOfPoint})));
    })
});


const points = { getParkingsList, insertPoint, getPointById, getPointsInBounds, linkableHuts, linkableStartPoints, linkableEndPoints , linkPointToHike }
module.exports = points;
















