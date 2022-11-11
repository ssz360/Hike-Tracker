const db=require('./dao');
const MAXDOUBLE = 4294967295;


getHikesList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES'              
    db.all(sql, [], (err, row) => {
        if(err) {
            reject(err);
            return;
        }
        const hikes = row.map((h) => ({IDHike: h.IDHike, Name: h.Name, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, ReferencePoints: h.ReferencePoints, Description: h.Description}))
        resolve(hikes);
    });
});

getHikesListWithFilters = async (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty) => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES WHERE Length >= ? AND Length <= ? AND ExpectedTime >= ? AND ExpectedTime <= ? AND Ascent >=  ? AND Ascent <= ?';
    
    const lenMin = lengthMin == null ? 0 : lengthMin;
    const lenMax = lengthMax == null ? MAXDOUBLE : lengthMax;
    
    const expMin = expectedTimeMin == null ? 0 : expectedTimeMin;
    const expMax = expectedTimeMax == null ? MAXDOUBLE : expectedTimeMax;
    
    const ascMin = ascentMin == null ? 0 : ascentMin;
    const ascMax = ascentMax == null ? MAXDOUBLE : ascentMax;

    let sql2 = sql;
    
    if (difficulty != null) {
        sql2 = sql + " AND Difficulty = ?";
        db.all(sql2, [lenMin, lenMax, expMin, expMax, ascMin, ascMax, difficulty], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            const hikes = row.map((h) => ({IDHike: h.IDHike, Name: h.Name, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, ReferencePoints: h.ReferencePoints, Description: h.Description}))
            resolve(hikes);
        });
    } else {   
        db.all(sql, [lenMin, lenMax, expMin, expMax, ascMin, ascMax], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            const hikes = row.map((h) => ({IDHike: h.IDHike, Name: h.Name, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, ReferencePoints: h.ReferencePoints, Description: h.Description}))
            resolve(hikes);
        });
    }
});

const hikes = {getHikesList, getHikesListWithFilters}
module.exports = hikes;