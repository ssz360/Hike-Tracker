const db=require('./dao');
const MAXDOUBLE = 4294967295;

getHikesWithMapList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT H.IDHike AS IDHike,Name,Length,ExpectedTime,Ascent,Difficulty,StartPoint,EndPoint,ReferencePoints,Description,Coordinates,Center FROM HIKES H,HIKESMAPDATA M WHERE H.IDHike=M.IDHike'              
    db.all(sql, [], async (err, rows) => {
        if(err) {
            reject(err);
            return;
        }
        resolve(rows.map(h=>({id:h.IDHike,name:h.Name,length:h.Length,
            expectedTime:h.ExpectedTime,ascent:h.Ascent,
            difficulty:h.Difficulty,startPoint:h.StartPoint,
            endPoint:h.EndPoint,referencePoints:h.ReferencePoints,
            description:h.Description,coordinates:JSON.parse(h.Coordinates),
            center:JSON.parse(h.Center)})));
    });
});

newHike=async (name,author,len,ascent,desc,difficulty,startPoint,endPoint,referencePoints,coordinates,center,bounds)=>new Promise((resolve, reject) => {
    const sqlhike="INSERT INTO HIKES (Name , Author, Length, ExpectedTime, Ascent, Difficulty, StartPoint, EndPoint, ReferencePoints, Description) VALUES(?,?,?,?,?,?,?,?,?,?)";
    const sqlmap="INSERT INTO HIKESMAPDATA(Coordinates,Center,Bounds) VALUES(?,?,?)";
    db.run(sqlhike,[name,author,len,0,ascent,difficulty,startPoint,endPoint,referencePoints,desc],err=>{
        if (err){
            console.log("Err hike query",err);
            reject({status:503,message:{err}});
        }
        else db.run(sqlmap,[coordinates,center,bounds],errmap=>{
            if (errmap){
                console.log("Err hikemapdata",err);
                reject({status:503,message:{err}});
            }
            else resolve();
        });
    });
});

getHikesList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES'              
    db.all(sql, [], (err, row) => {
        if(err) {
            reject(err);
            return;
        }
        const hikes = row.map((h) => ({IDHike: h.IDHike, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, ReferencePoints: h.ReferencePoints, Description: h.Description}))
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
            const hikes = row.map((h) => ({IDHike: h.IDHike, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, ReferencePoints: h.ReferencePoints, Description: h.Description}))
            resolve(hikes);
        });
    } else {   
        db.all(sql, [lenMin, lenMax, expMin, expMax, ascMin, ascMax], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            const hikes = row.map((h) => ({IDHike: h.IDHike, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, ReferencePoints: h.ReferencePoints, Description: h.Description}))
            resolve(hikes);
        });
    }
});

const hikes = {getHikesList,getHikesWithMapList, getHikesListWithFilters,newHike};
module.exports = hikes;