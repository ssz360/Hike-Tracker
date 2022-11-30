const db = require('./dao');
const points = require('./points');
const MAXDOUBLE = 4294967295;


const insertHikePoint=async (hikeId,lat,lon,index)=>new Promise((resolve,reject)=>{
    const sql="INSERT INTO HIKESCOORDINATES(hikeId,indexCoor,latitude,longitude) VALUES(?,?,?,?)";
    db.run(sql,[hikeId,index,lat,lon],err=>{
        if(err){
            console.log("ERR IN INSERT COORDINATE",err,"WITH DATA HIKEID",hikeId,"lat",lat,"lon",lon,"index",index);
            reject({ status: 503, message: { err } });
        }
        else resolve();
    })
})

const newHike = async (name, author, len,expectedTime, ascent, desc, difficulty, startPoint, endPoint, coordinates, centerlat, centerlon, maxlat,maxlon,minlat,minlon) => new Promise((resolve, reject) => {
    const sqlhike = "INSERT INTO HIKES (Name , Author, Length, ExpectedTime,CenterLat, CenterLon, Ascent, Difficulty, StartPoint, EndPoint, Description) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    const sqlmap = "INSERT INTO HIKESMAPDATA(CenterLat,CenterLon,MaxLat,MaxLon,MinLat,MinLon) VALUES(?,?,?,?,?,?)";
    db.run(sqlhike, [name, author, len, expectedTime, centerlat, centerlon, ascent, difficulty, startPoint, endPoint, desc], err => {
        if (err) {
            console.log("Err new hike query",err);
            reject({ status: 503, message: { err } });
        }
        else db.run(sqlmap, [centerlat,centerlon,maxlat,maxlon,minlat,minlon], errmap => {
            if (errmap) {
                console.log("Err INSERT INTO hikemapdata",errmap);
                reject({ status: 503, message: { err } });
            }
            else{
                db.get("SELECT MAX(IDHike) AS max FROM HIKES",[],(errId,rowId)=>{
                    if (err) {
                        console.log("Err Get id query",errId);
                        reject({ status: 503, message: { errId } });
                    }
                    const proms=[];
                    const hikeId=rowId.max;
                    let i=0;
                    //console.log("\t\tCoordinates",coordinates);
                    for (const c of coordinates){
                        //console.log("Coordinate to insert c ",c);
                        proms.push(insertHikePoint(hikeId,c[0],c[1],i));
                        i++;
                    }
                    Promise.all(proms).then(()=>resolve()).catch(err=>reject({ status: 503, message: { err } }));
                })
            }
        });
    });
});

getHikesList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES'
    db.all(sql, [], async (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        //console.log("Before adding points rows were ",row);
        row = await getHikesMoreData(row);

        const hikes = row.map((h) => ({ IDHike: h.IDHike, Name: h.Name, Author: h.Author, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, Description: h.Description, startPoint: h.startPoint, endPoint: h.endPoint, referencePoints: h.referencePoints }))
        //console.log("Returning hikes",hikes);
        resolve(hikes);
    });
});


const getHikesListWithFilters = async (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, centerlat, centerlon, radius) => new Promise((resolve, reject) => {
    //console.log("Pars",getMap,lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty,centerlat,centerlon,latdeg,londegr)
    const sql = 'SELECT * FROM HIKES H WHERE Length >= ? AND Length <= ? AND ExpectedTime >= ? AND ExpectedTime <= ? AND Ascent >=  ? AND Ascent <= ? AND (((CenterLat-?)*(CenterLat-?))+((CenterLon-?)*(CenterLon-?)))<=? AND UPPER(Difficulty) LIKE UPPER(?)';

    const lenMin = lengthMin == null ? 0 : lengthMin;
    const lenMax = lengthMax == null ? MAXDOUBLE : lengthMax;

    const expMin = expectedTimeMin == null ? 0 : expectedTimeMin;
    const expMax = expectedTimeMax == null ? MAXDOUBLE : expectedTimeMax;

    const ascMin = ascentMin == null ? 0 : ascentMin;
    const ascMax = ascentMax == null ? MAXDOUBLE : ascentMax;

    const diff = difficulty == null ? '%' : difficulty;
    //console.log("lenMin",lenMin,"lenMax",lenMax,"expmin",expMin,"expmax",expMax,"ascmin",ascMin,"ascmax",ascMax,"maxlen",maxLen,"maxLon",maxLon,"minlen",minLen,"minlon",minLon);

    //console.log("SQL IS ",sql2,"with pars");
    db.all(sql, [lenMin, lenMax, expMin, expMax, ascMin, ascMax, centerlat, centerlat, centerlon, centerlon, radius, diff], async (err, row) => {
        if (err) {
            console.log("Err in get hikes with filters",err);
            reject(err);
            return;
        }

        //console.log("Before adding points rows were ",row);
        row = await getHikesMoreData(row);
        const result = row.map((h) => ({ id: h.IDHike, name: h.Name, author: h.Author, length: h.Length, expectedTime: h.ExpectedTime, ascent: h.Ascent, difficulty: h.Difficulty, startPoint: h.startPoint, endPoint: h.endPoint, referencePoints: h.referencePoints, description: h.Description }));
        console.log("Returning hikes",result);
        resolve(result);
    });

});

const getHikesMoreData = async (row) => {
    const getReferencePoints = (id) => new Promise((resolve, reject) => {
        const referencePointsSql = "SELECT * FROM REFERENCE_POINTS AS R JOIN POINTS AS P ON P.IDPoint = R.IDPoint WHERE R.IDHike = ?";

        db.all(referencePointsSql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(r=>({id:r.IDPoint,name:r.Name,geographicalArea:r.GeographicalArea,coordinates:[r.Latitude,r.Longitude],typeOfPoint:r.TypeOfPoint})));
        })
    })

    for (let item of row) {

        await points.getPointById(item.StartPoint).then(startPoint => {
            item.startPoint = {id:startPoint.IDPoint,name:startPoint.Name,geographicalArea:startPoint.GeographicalArea,coordinates:[startPoint.Latitude,startPoint.Longitude],typeOfPoint:startPoint.TypeOfPoint};
            points.getPointById(item.EndPoint).then(endPoint => {
                item.endPoint = {id:endPoint.IDPoint,name:endPoint.Name,geographicalArea:endPoint.GeographicalArea,coordinates:[endPoint.Latitude,endPoint.Longitude],typeOfPoint:endPoint.TypeOfPoint};
            })
        });
        item.referencePoints = await getReferencePoints(item.IDHike);
    }

    return row;
}

const getHikeMap = async id => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKESMAPDATA WHERE IDHike=?'
    db.get(sql, [id], (err, row) => {
        //console.log("MAP RET",row,"err",err);
        if (err) {
            console.log("ERR IN HIKESMAPDATA",err);
            reject({ status: 503, message: err });
            return;
        }
        else if (row === undefined) reject({ status: 404, message: "No hike associated to this id" });
        const sqlcoors="SELECT latitude,longitude,indexCoor FROM HIKESCOORDINATES WHERE hikeId=?";
        db.all(sqlcoors,[id],(err,rows)=>{
            if(err){
                console.log("ERR IN SQLCOORS",err);
                reject({ status: 503, message: err });
            }
            else{
                resolve({ id: row.IDHike, coordinates: rows.sort((a,b)=>a.indexCoor-b.indexCoor).map(c=>[c.latitude,c.longitude]), center: [row.CenterLat,row.CenterLon], bounds: [[row.MaxLat,row.MaxLon],[row.MinLat,row.MinLon]] });
            }
        })
        
        //resolve({ id: row.IDHike, coordinates: JSON.parse(row.Coordinates), center: JSON.parse(row.Center), bounds: JSON.parse(row.Bounds) })
    });
});

const addReferenceToHike = async (IDHike, IDPoint) => new Promise((resolve, reject) => {
    const getHikeSql = 'SELECT * FROM HIKES WHERE IDHike = ? ';
    const getPoint = 'SELECT * FROM POINTS WHERE IDPoint = ? ';

    db.all(getHikeSql, [IDHike], (err, row) => {
        if (err) {
            reject({ code: 500, message: err });
            return;
        }

        if (!row || !row.length) {
            reject({ code: 404, message: 'hike not found' });
            return;
        }

        db.all(getPoint, [IDPoint], (err, row) => {
            if (err) {
                reject({ code: 500, message: err });
                return;
            }
    
            if(!row || !row.length) {
                reject({code:404,message:'point not found'});
                return;
            }

            const sqlPoint = "INSERT INTO REFERENCE_POINTS (IDHike, IDPoint) VALUES(?,?)";


            db.run(sqlPoint, [IDHike, IDPoint], err => {
                if (err) {
                    reject({ code: 500, message: err });
                    return;
                }
                resolve();
            })
        });
    });
});


const updateStartingArrivalPoint = async (hikeId, startPointId, endPointId) => new Promise((resolve, reject) => {

    const checkIfPointExistsSql = 'SELECT * FROM POINTS WHERE IDPoint=?';

    const setStartPoint = () => new Promise((resolve, reject) => {

        if (startPointId) {
            db.all(checkIfPointExistsSql, [startPointId], (err, row) => {
                if (err) {
                    reject({ code: 500, message: err });
                    return;
                }
                if (row.length === 0) {
                    reject({ code: 404, message: "Start point didn't found" });
                    return;
                }
                const sql = "UPDATE HIKES SET StartPoint = ? WHERE IDHike = ?";
                db.run(sql, [startPointId, hikeId], err => {
                    if (err) {
                        reject({ code: 500, message: err });
                        return;
                    }
                    resolve();
                })
            });

        }
    });

    const setEndPoint = () => new Promise((resolve, reject) => {
        if (endPointId) {
            db.all(checkIfPointExistsSql, [endPointId], (err, row) => {
                if (err) {
                    reject({ code: 500, message: err });
                    return;
                }
                if (row.length === 0) {
                    reject({ code: 404, message: "End point didn't found" });
                    return;
                }
                const sql = "UPDATE HIKES SET EndPoint = ? WHERE IDHike = ?";
                db.run(sql, [endPointId, hikeId], err => {
                    if (err) {
                        reject({ code: 500, message: err });
                        return;
                    }
                    resolve();

                })
            });

        }
    });

    if (startPointId && endPointId) {
        setStartPoint().then(() => {
            setEndPoint().then(resolve);
        }).catch(reject);
    } else if (startPointId) {
        setStartPoint().then(resolve).catch(reject);
    } else if (endPointId) {
        setEndPoint().then(resolve).catch(reject);
    } else {
        reject({ code: 500, message: "startPoint or endPoint must be defined" });
    }



});

const hikes = { getHikesList, getHikesListWithFilters, newHike, getHikeMap, addReferenceToHike, updateStartingArrivalPoint };
module.exports = hikes;