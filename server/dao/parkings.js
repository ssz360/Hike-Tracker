const db = require('./dao');
const { insertPoint, getGeoArea } = require('./points');


const getParkingsList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM PARKINGS AS P JOIN POINTS AS M ON P.IDPoint = M.IDPoint'
    db.all(sql, [], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const pks = row.map((p) => ({ IDPoint: p.IDPoint, Name: p.Name, Description: p.Description, SlotsTot: p.SlotsTot, SlotsFull: p.SlotsFull, TypeOfPoint: p.TypeOfPoint, Coordinates: [p.Latitude,p.Longitude], GeographicalArea: getGeoArea(p) }))
        resolve(pks);
    });
});

const addParking = async (pk, geodata) => {
    console.log("IN ADDPARKING DAO");
    console.log(pk);
    console.log(geodata);
    try {
        return new Promise((resolve, reject) => {


            const sql = 'INSERT INTO PARKINGS(IDPoint,SlotsTot,SlotsFull) VALUES(?,?,?)';
    
            insertPoint(pk.name, pk.coordinates[0],pk.coordinates[1], geodata.altitude, geodata.geopos, 'parking', pk.description).then(pointId => {
                db.run(sql, [pointId, pk.slots, 0], function (err) {
                    if (err) {
                        reject({status: 500, message: err.toString()});
                        return;
                    }
                    resolve(this.lastID);
                });
            }).catch(reject);
        });
    } catch (error) {
        throw error;
    }
};

const parkings = {addParking, getParkingsList}
module.exports = parkings;