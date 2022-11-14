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

getUserType= async u=> new Promise((resolve, reject) => {
    const sql = 'SELECT Type FROM USERS WHERE Username = ?'              
    db.all(sql, [u], (err, row) => {
        if(err) reject({status:503,message:err});
        else if(row===undefined) reject({status:404,message:"This user doesn't exists"});
        else resolve(row.Type);
    });
});

const users = {getType,getUserType}
module.exports = users;