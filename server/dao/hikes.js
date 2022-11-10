const db=require('./dao');
const fs=require('fs');
const gpxParser = require('gpxparser');
const getCoordinates=async path=>{
    try {
        console.log("Here in getcoordinates with path ",path);
        console.log("Current directory:", __dirname);
        const gpxToParse= await fs.readFileSync(__dirname+'/hikestracks/'+path,'utf-8');
        gpx.parse(gpxToParse);
        return gpx.toGeoJSON().features[0].geometry.coordinates.map(e=>[e[1],e[0]]);
    } catch (error) {
        console.log("Catched error in getcoordinates ",error);
        throw {status: 503, message : error};
    }
}
const getHike=async h=>{
    try {
        console.log("Here in getHike with ",h);
        const hike={id:h.IDHike,length:h.Length,expectedTime:h.ExpectedTime,coordinates:[]};
        hike.coordinates=await getCoordinates(h.Coordinates);
        console.log(JSON.stringify(hike.coordinates));
        return hike;
    } catch (error) {
        console.log("Catched error in getHike ",error);
        throw {status: 503, message : error};
    }
}
getHikesWithMapList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT H.IDHike AS IDHike,Name,Length,ExpectedTime,Ascent,Difficulty,StartPoint,EndPoint,ReferencePoints,Description,Coordinates,Center FROM HIKES H,HIKESMAPDATA M WHERE H.IDHike=M.IDHike'              
    db.all(sql, [], async (err, rows) => {
        if(err) {
            reject(err);
            return;
        }
        //console.log(rows)
        //const promises=[];
        //const hike={id:h.IDHike,length:h.Length,expectedTime:h.ExpectedTime,coordinates:[]};
        //hike.coordinates=await getCoordinates(h.Coordinates);
        //console.log(JSON.stringify(hike.coordinates));
        //resolve(hike);
        /*const centers=[];
        rows.forEach(h=>{
            coor=JSON.parse(h.Coordinates);
            const lats=[];
            const lens=[];
            coor.forEach(c=>{lats.push(c[0]);lens.push(c[1])});
            console.log("lats",lats," max lats ",Math.max(...lats),"min lats",Math.min(...lats))
            centers.push([(Math.max(...lats)+Math.min(...lats))/2,(Math.max(...lens)+Math.min(...lens))/2]);
        })
        console.log("Centers ",centers);*/
        resolve(rows.map(h=>({id:h.IDHike,name:h.Name,length:h.Length,
            expectedTime:h.ExpectedTime,ascent:h.Ascent,
            difficulty:h.Difficulty,startPoint:h.StartPoint,
            endPoint:h.EndPoint,referencePoints:h.ReferencePoints,
            description:h.Description,coordinates:JSON.parse(h.Coordinates),
            center:JSON.parse(h.Center)})));
        //Promise.all(promises).then(h=>resolve(h)).catch(c=>reject({status:503,message:"Error while reading hikes"}));
    });
});

const newHike=async (name,desc,difficulty,hike)=>new Promise((resolve, reject) => {
    console.log("In new hike with",name,desc,difficulty);
    const gpx = new gpxParser();gpx.parse(hike.toString());
    console.log("Finished parsing");
    const coors=[];
    gpx.tracks[0].points.forEach(p =>coors.push([p["lat"],p["lon"]]));
    const lats=coors.map(p=>p[0]);
    const lons=coors.map(p=>p[1]);
    console.log("Finished center and coors");
    const center=[(Math.max(...lats)+Math.min(...lats))/2,(Math.max(...lons)+Math.min(...lons))/2];
    console.log("Center ",center);
    const sqlhike="INSERT INTO HIKES (Name ,Length, ExpectedTime, Ascent, Difficulty, StartPoint, EndPoint, ReferencePoints, Description) VALUES(?,?,?,?,?,?,?,?,?)";
    const sqlmap="INSERT INTO HIKESMAPDATA(Coordinates,Center) VALUES(?,?)";
    db.run(sqlhike,[name,gpx.tracks[0].distance["total"],0,gpx.tracks[0].elevation["max"]-gpx.tracks[0].elevation["min"],difficulty.toUpperCase(),"","",null,desc],err=>{
        if (err){
            console.log("Err hike query",err);
            reject({status:503,message:{err}});
        }
        else db.run(sqlmap,[JSON.stringify(coors),JSON.stringify(center)],errmap=>{
            if (errmap){
                console.log("Err hikemapdata",err);
                reject({status:503,message:{err}});
            }
            else resolve();
        });
    });
});

const hikes = {getHikesWithMapList,newHike}
module.exports = hikes;