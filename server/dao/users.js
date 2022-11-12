const db=require('./dao');

getType = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS P, HUTS H WHERE P.IDPoint = H.IDPoint'              
    db.all(sql, [], (err, row) => {
        if(err) {
            reject(err);
            return;
        }
        const huts = row.map((h) => ({IDPoint: h.IDPoint, Name: h.Name, Coordinates: h.Coordinates, GeographicalArea: h.GeographicalArea}))
        resolve(huts);
    });
});

const users = {getType}
module.exports = users;