const db=require('./dao');

getHikesList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES'              
    db.all(sql, [], (err, row) => {
        if(err) {
            reject(err);
            return;
        }
        const hikes = row.map((h) => ({IDPoint: h.IDPoint, Name: h.Name, Coordinates: h.Coordinates, GeographicalArea: h.GeographicalArea, TypeOfPoint: h.TypeOfPoint}))
        resolve(hikes);
    });
});

const hikes = {getHikesList}
module.exports = hikes;