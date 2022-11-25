const db = require('./dao');
const points = require('./points');
const MAXDOUBLE = 4294967295;

/*getHikesWithMapList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT H.IDHike AS IDHike,Name,Length,ExpectedTime,Ascent,Difficulty,StartPoint,EndPoint,Description,Coordinates,Center FROM HIKES H,HIKESMAPDATA M WHERE H.IDHike=M.IDHike'              
    db.all(sql, [], async (err, rows) => {
        if(err) {
            reject(err);
            return;
        }
        resolve(rows.map(h=>({id:h.IDHike,name:h.Name,length:h.Length,
            expectedTime:h.ExpectedTime,ascent:h.Ascent,
            difficulty:h.Difficulty,startPoint:h.StartPoint,
            endPoint:h.EndPoint,
            description:h.Description,coordinates:JSON.parse(h.Coordinates),
            center:JSON.parse(h.Center)})));
    });
});*/

const newHike = async (name, author, len, ascent, desc, difficulty, startPoint, endPoint, coordinates, centerlat, centerlon, maxLen, maxLon, minLen, minLon) => new Promise((resolve, reject) => {
    const sqlhike = "INSERT INTO HIKES (Name , Author, Length, ExpectedTime, Ascent, Difficulty, StartPoint, EndPoint, Description) VALUES(?,?,?,?,?,?,?,?,?)";
    const sqlmap = "INSERT INTO HIKESMAPDATA(Coordinates,CenterLat,CenterLon,MaxLen,MaxLon,MinLen,MinLon) VALUES(?,?,?,?,?,?,?)";
    db.run(sqlhike, [name, author, len, 0, ascent, difficulty, startPoint, endPoint, desc], err => {
        if (err) {
            //console.log("Err hike query",err);
            reject({ status: 503, message: { err } });
        }
        else db.run(sqlmap, [coordinates, centerlat, centerlon, maxLen, maxLon, minLen, minLon], errmap => {
            if (errmap) {
                //console.log("Err hikemapdata",err);
                reject({ status: 503, message: { err } });
            }
            else resolve();
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
        row = await getHikesMoreData(row);

        const hikes = row.map((h) => ({ IDHike: h.IDHike, Name: h.Name, Author: h.Author, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, Description: h.Description, startPoint: h.startPoint, endPoint: h.endPoint, referencePoints: h.referencePoints }))
        resolve(hikes);
    });
});

/*isHikeInArea= async (hike,maxlen,minlen,maxlon,minlon)=> new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKESMAPDATA WHERE IDHike=?';    
    //console.log("In ishikeinarea" ,hike.IDHike,"and ",maxlen,minlen,maxlon,minlon);          
    db.get(sql, [hike.IDHike], (err, row) => {
        if(err) {
            //console.log("Eerr",err);
            resolve(false);
            return;
        }
        //console.log("bbb",row);
        let b;
        const center=JSON.parse(row.Center);
        if (center[0]<=maxlen && center[0]>=minlen && center[1]<=maxlon && center[1]>=minlon)   b=true;
        else b=false;
        //console.log(b,"for id",hike.IDHike);
        resolve(b?hike:undefined);
    });
});*/

/*getHikesListWithFilters = async (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty,maxlen,minlen,maxlon,minlon) => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM HIKES WHERE Length >= ? AND Length <= ? AND ExpectedTime >= ? AND ExpectedTime <= ? AND Ascent >=  ? AND Ascent <= ?';
    
    const lenMin = lengthMin == null ? 0 : lengthMin;
    const lenMax = lengthMax == null ? MAXDOUBLE : lengthMax;
    
    const expMin = expectedTimeMin == null ? 0 : expectedTimeMin;
    const expMax = expectedTimeMax == null ? MAXDOUBLE : expectedTimeMax;
    
    const ascMin = ascentMin == null ? 0 : ascentMin;
    const ascMax = ascentMax == null ? MAXDOUBLE : ascentMax;

    console.log("lenMin",lenMin,"lenMax",lenMax,"expmin",expMin,"expmax",expMax,"ascmin",ascMin,"ascmax",ascMax);
    let sql2 = sql;
    
    if (difficulty != null) {
        sql2 = sql + " AND Difficulty = ?";
        console.log("Sql ",sql2);
        db.all(sql2, [lenMin, lenMax, expMin, expMax, ascMin, ascMax, difficulty], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            let hikes;
            console.log("Rows are",row);
            if(maxlen===undefined){
                resolve(hikes);
                hikes=row.map((h) => ({IDHike: h.IDHike, Name: h.Name, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, Description: h.Description}))
            }
            else{
                const proms=[];
                let hikes=[];
                row.forEach(r=>proms.push(isHikeInArea({IDHike: r.IDHike, Name: r.Name, Length: r.Length, ExpectedTime: r.ExpectedTime, Ascent: r.Ascent, Difficulty: r.Difficulty, StartPoint: r.StartPoint, EndPoint: r.EndPoint, Description: r.Description},maxle,minlen,maxlon,minlon)));
                Promise.all(proms).then(res=>{
                    res.forEach(h=>{
                        if(h!==undefined) hikes.push(h);
                    });
                    console.log("hikes with area",hikes);
                    resolve(hikes);
                });
            }
        });
    } else {   
        console.log("Sql no  diff ",sql2);
        db.all(sql, [lenMin, lenMax, expMin, expMax, ascMin, ascMax], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            let hikes=[];
            console.log("Rows are",row);
            if (maxlen===undefined){
                hikes=row.map((h) => ({IDHike: h.IDHike, Name: h.Name, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, StartPoint: h.StartPoint, EndPoint: h.EndPoint, Description: h.Description}));
                resolve(hikes);
            }
            else{
                const proms=[];
                row.forEach(r=>proms.push(isHikeInArea({IDHike: r.IDHike, Name: r.Name, Length: r.Length, ExpectedTime: r.ExpectedTime, Ascent: r.Ascent, Difficulty: r.Difficulty, StartPoint: r.StartPoint, EndPoint: r.EndPoint, Description: r.Description},maxlen,minlen,maxlon,minlon)));
                Promise.all(proms).then(res=>{
                    res.forEach(h=>{
                        if(h!==undefined) hikes.push(h);
                    });
                    console.log("hikes with area",hikes);
                    resolve(hikes);
                });
            }
        });
    }
});*/


const getHikesListWithFilters = async (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, centerlat, centerlon, latdeg, londegr) => new Promise((resolve, reject) => {
    //console.log("Pars",getMap,lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty,centerlat,centerlon,latdeg,londegr)
    const sql = 'SELECT * FROM HIKES H WHERE Length >= ? AND Length <= ? AND ExpectedTime >= ? AND ExpectedTime <= ? AND Ascent >=  ? AND Ascent <= ? AND abs(CenterLat-?)<=? AND abs(CenterLon-?)<=? AND UPPER(Difficulty) LIKE UPPER(?)';

    const lenMin = lengthMin == null ? 0 : lengthMin;
    const lenMax = lengthMax == null ? MAXDOUBLE : lengthMax;

    const expMin = expectedTimeMin == null ? 0 : expectedTimeMin;
    const expMax = expectedTimeMax == null ? MAXDOUBLE : expectedTimeMax;

    const ascMin = ascentMin == null ? 0 : ascentMin;
    const ascMax = ascentMax == null ? MAXDOUBLE : ascentMax;

    const diff = difficulty == null ? '%' : difficulty;
    //console.log("lenMin",lenMin,"lenMax",lenMax,"expmin",expMin,"expmax",expMax,"ascmin",ascMin,"ascmax",ascMax,"maxlen",maxLen,"maxLon",maxLon,"minlen",minLen,"minlon",minLon);

    //console.log("SQL IS ",sql2,"with pars");
    db.all(sql, [lenMin, lenMax, expMin, expMax, ascMin, ascMax, centerlat, latdeg, centerlon, londegr, diff], async (err, row) => {
        if (err) {
            reject(err);
            return;
        }


        row = await getHikesMoreData(row);
        const result = row.map((h) => ({ id: h.IDHike, name: h.Name, author: h.Author, length: h.Length, expectedTime: h.ExpectedTime, ascent: h.Ascent, difficulty: h.Difficulty, startPoint: h.StartPoint, endPoint: h.EndPoint, referencePoints: h.ReferencePoints, description: h.Description, startPoint: h.startPoint, endPoint: h.endPoint, referencePoints: h.referencePoints }));
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
            resolve(rows);
        })
    })

    for (let item of row) {

        await points.getPointById(item.StartPoint).then(startPoint => {
            item.startPoint = startPoint;
            points.getPointById(item.EndPoint).then(endPoint => {
                item.endPoint = endPoint;
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
            reject({ status: 503, message: err });
            return;
        }
        else if (row === undefined) reject({ status: 404, message: "No hike associated to this id" });
        resolve({ id: row.IDHike, coordinates: JSON.parse(row.Coordinates), center: JSON.parse(row.Center), bounds: JSON.parse(row.Bounds) })
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

            if (!row || !row.length) {
                reject({ code: 404, message: 'hike not found' });
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

    const checkIfPointExistsSql = 'SELECT * FROM HUTS as h,PARKINGS as p WHERE p.IDPoint=? OR h.IDPoint=?';

    const setStartPoint = () => new Promise((resolve, reject) => {

        if (startPointId) {
            db.all(checkIfPointExistsSql, [startPointId, startPointId], (err, row) => {
                if (err) {
                    reject({ code: 500, message: err });
                    return;
                }
                if (row.length === 0) {
                    reject({ code: 404, message: "Start point didn't found" });
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
            db.all(checkIfPointExistsSql, [endPointId, endPointId], (err, row) => {
                if (err) {
                    reject({ code: 500, message: err });
                    return;
                }
                if (row.length === 0) {
                    reject({ code: 404, message: "Start point didn't found" });
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