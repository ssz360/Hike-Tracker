const db = require('./dao');
const points = require('./points');
const MAXDOUBLE = 4294967295;

const getHikeMoreData = async (item) => {
    const getLinkedPoints = (id) => new Promise(async (resolve, reject) => {
        const linkedPointsSql = "SELECT * FROM LINKEDPOINTS AS R JOIN POINTS AS P ON P.IDPoint = R.IDPoint WHERE R.IDHike = ?";

        db.all(linkedPointsSql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(r=>({id:r.IDPoint,name:r.Name,geographicalArea:points.getGeoArea(r),coordinates:[r.Latitude,r.Longitude],typeOfPoint:r.TypeOfPoint})));
        })
    })

    const start=await points.getPointById(item.StartPoint);
    const end=await points.getPointById(item.EndPoint);
    item.startPoint = {id:start.IDPoint,name:start.Name,geographicalArea:points.getGeoArea(start),coordinates:[start.Latitude,start.Longitude],typeOfPoint:start.TypeOfPoint};
    item.endPoint = {id:end.IDPoint,name:end.Name,geographicalArea:points.getGeoArea(end),coordinates:[end.Latitude,end.Longitude],typeOfPoint:end.TypeOfPoint};
    //console.log("Got more data for row",item);
    const linkedPoints = await getLinkedPoints(item.IDHike);
    item.referencePoints=linkedPoints.filter(p=>p.typeOfPoint=="referencePoint" || p.typeOfPoint=="hikePoint");
    item.huts=linkedPoints.filter(p=>p.typeOfPoint==="hut");

    return item;
}


const getHike=async id=>new Promise((resolve,reject)=>{
    const sql="SELECT * FROM HIKES WHERE IDHike=?";
    db.get(sql,[id],(err,row)=>{
        if(err) throw {status:503,message:err};
        else if(row===undefined) throw {status:404,message:"Hike not found!"};
        else{
            getHikeMoreData(row).then(res=>resolve(res)).catch(err=>reject(ret));
        }
    })
})


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
                    const hikeId=rowId.max;
                    const proms=[points.linkPointToHike(hikeId,startPoint)];
                    if(startPoint!==endPoint) proms.push(points.linkPointToHike(hikeId,endPoint));
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

        const hikes = row.map((h) => ({ IDHike: h.IDHike, Name: h.Name, Author: h.Author, Length: h.Length, ExpectedTime: h.ExpectedTime, Ascent: h.Ascent, Difficulty: h.Difficulty, Description: h.Description, startPoint: h.startPoint, endPoint: h.endPoint, referencePoints: h.referencePoints, huts: h.huts, center: [h.CenterLat,h.CenterLon] }))
        //console.log("Returning hikes",hikes);
        resolve(hikes);
    });
});


const getHikesListWithFilters = async (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, centerlat, centerlon, radius) => new Promise((resolve, reject) => {
    //console.log("Pars",getMap,lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty,centerlat,centerlon,latdeg,londegr)
    const sql = 'SELECT * FROM HIKES H WHERE Length >= ? AND Length <= ? AND ExpectedTime >= ? AND ExpectedTime <= ? AND Ascent >=  ? AND Ascent <= ? AND 2 * 6371 * sqrt(pow(sin((radians(?) - radians(CenterLat)) / 2), 2)+ cos(radians(CenterLat))* cos(radians(?))* pow(sin((radians(?) - radians(CenterLon)) / 2), 2))<=? AND UPPER(Difficulty) LIKE UPPER(?)';

    const lenMin = lengthMin == null ? 0 : lengthMin;
    const lenMax = lengthMax == null ? MAXDOUBLE : lengthMax;

    const expMin = expectedTimeMin == null ? 0 : expectedTimeMin;
    const expMax = expectedTimeMax == null ? MAXDOUBLE : expectedTimeMax;

    const ascMin = ascentMin == null ? 0 : ascentMin;
    const ascMax = ascentMax == null ? MAXDOUBLE : ascentMax;

    const diff = difficulty == null ? '%' : difficulty;
    //console.log("lenMin",lenMin,"lenMax",lenMax,"expmin",expMin,"expmax",expMax,"ascmin",ascMin,"ascmax",ascMax,"maxlen",maxLen,"maxLon",maxLon,"minlen",minLen,"minlon",minLon);

    //console.log("SQL IS ",sql2,"with pars");
    db.all(sql, [lenMin, lenMax, expMin, expMax, ascMin, ascMax, centerlat, centerlat, centerlon, radius, diff], async (err, row) => {
        if (err) {
            console.log("Err in get hikes with filters",err);
            reject(err);
            return;
        }

        console.log("Before adding points rows were ",row);
        row = await getHikesMoreData(row);
        const result = row.map((h) => ({ id: h.IDHike, name: h.Name, author: h.Author, length: h.Length, expectedTime: h.ExpectedTime, ascent: h.Ascent, difficulty: h.Difficulty, startPoint: h.startPoint, endPoint: h.endPoint, referencePoints: h.referencePoints, huts:h.huts, description: h.Description, center: [h.CenterLat,h.CenterLon] }));
        console.log("Returning hikes",result);
        resolve(result);
    });

});

const getHikesMoreData = async (row) => {
    const getLinkedPoints = (id) => new Promise(async (resolve, reject) => {
        const linkedPointsSql = "SELECT * FROM LINKEDPOINTS AS R JOIN POINTS AS P ON P.IDPoint = R.IDPoint WHERE R.IDHike = ?";

        db.all(linkedPointsSql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(r=>({id:r.IDPoint,name:r.Name,geographicalArea:points.getGeoArea(r),coordinates:[r.Latitude,r.Longitude],typeOfPoint:r.TypeOfPoint})));
        })
    })

    for (let item of row) {
        //console.log("Getting more data for row",item);
        const start=await points.getPointById(item.StartPoint);
        const end=await points.getPointById(item.EndPoint);
        item.startPoint = {id:start.IDPoint,name:start.Name,geographicalArea:points.getGeoArea(start),coordinates:[start.Latitude,start.Longitude],typeOfPoint:start.TypeOfPoint};
        item.endPoint = {id:end.IDPoint,name:end.Name,geographicalArea:points.getGeoArea(end),coordinates:[end.Latitude,end.Longitude],typeOfPoint:end.TypeOfPoint};
        console.log("Got more data for row",item);
        const linkedPoints = await getLinkedPoints(item.IDHike);
        item.referencePoints=linkedPoints.filter(p=>p.typeOfPoint=="referencePoint" || p.typeOfPoint=="hikePoint");
        item.huts=linkedPoints.filter(p=>p.typeOfPoint==="hut");
    }

    return row;
}

const getCoordinatesHike= async (row)=>new Promise((resolve,reject)=>{
    const sqlcoors="SELECT latitude,longitude,indexCoor FROM HIKESCOORDINATES WHERE hikeId=? ORDER BY indexCoor";
    db.all(sqlcoors,[row.IDHike],(err,rows)=>{
        if(err){
            console.log("ERR IN SQLCOORS",err);
            reject({ status: 503, message: err });
        }
        else{
            resolve({ id: row.IDHike, coordinates: rows.map(c=>[c.latitude,c.longitude]), center: [row.CenterLat,row.CenterLon], bounds: [[row.MaxLat,row.MaxLon],[row.MinLat,row.MinLon]] });
        }
    })
})


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
        /*const sqlcoors="SELECT latitude,longitude,indexCoor FROM HIKESCOORDINATES WHERE hikeId=?";
        db.all(sqlcoors,[id],(err,rows)=>{
            if(err){
                console.log("ERR IN SQLCOORS",err);
                reject({ status: 503, message: err });
            }
            else{
                resolve({ id: row.IDHike, coordinates: rows.sort((a,b)=>a.indexCoor-b.indexCoor).map(c=>[c.latitude,c.longitude]), center: [row.CenterLat,row.CenterLon], bounds: [[row.MaxLat,row.MaxLon],[row.MinLat,row.MinLon]] });
            }
        })*/
        getCoordinatesHike(row).then(res=>resolve(res)).catch(err=>reject(err));
        
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

const hikesInBounds=async (maxlat,maxlon,minlat,minlon)=>new Promise((resolve,reject)=>{
    const hikessql = 'SELECT * FROM HIKESMAPDATA WHERE EXISTS(SELECT HIKESCOORDINATES.hikeId FROM HIKESCOORDINATES WHERE HIKESCOORDINATES.hikeId=HIKESMAPDATA.IDHike AND HIKESCOORDINATES.latitude<=? AND HIKESCOORDINATES.latitude>=? AND HIKESCOORDINATES.longitude<=? AND HIKESCOORDINATES.longitude>=?)';
    db.all(hikessql, [maxlat,minlat,maxlon,minlon], (err, rows) => {
        //console.log("MAP RET",row,"err",err);
        if (err) {
            console.log("ERR IN HIKESMAPDATA",err);
            reject({ status: 503, message: err });
            return;
        }
        //else if (row === undefined) reject({ status: 404, message: "No hike associated to this id" });
        const proms=[];
        rows.forEach(r=>proms.push(getCoordinatesHike(r)));
        Promise.all(proms).then(maps=>resolve(maps)).catch(err=>reject(err));
        
        //resolve({ id: row.IDHike, coordinates: JSON.parse(row.Coordinates), center: JSON.parse(row.Center), bounds: JSON.parse(row.Bounds) })
    });
})


const hikes = { getHike,getHikesList, getHikesListWithFilters, newHike, getHikeMap, addReferenceToHike, updateStartingArrivalPoint, hikesInBounds };
module.exports = hikes;