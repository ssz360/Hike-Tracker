const hikesdao=require('../dao/hikes');
const usersdao=require('../dao/users');
const gpxParser = require('gpxparser');
const pointsdao=require('../dao/points');
const points=require('./points');
const newHike=async (name,user,desc,difficulty,file)=>{
    try {
        //const typeUser=await usersdao.getUserType(user);
        //console.log("In new hike services");
        //console.log("User",user.username,"type",user.type);
        if(user.type!=="localGuide")    throw {status:401,message:"This type of user can't describe a new hike"};
        const gpx = new gpxParser();gpx.parse(file);
        if(gpx.tracks[0]===undefined) throw {status:244,message:"The gpx file provided is not a valid one"}
        const coors=[];
        gpx.tracks[0].points.forEach(p =>coors.push([p["lat"],p["lon"]]));
        //console.log("Points are",gpx.tracks[0].points);
        const lats=coors.map(p=>p[0]);const lons=coors.map(p=>p[1]);
        const centerlat=(Math.max(...lats)+Math.min(...lats))/2;
        const centerlon=(Math.max(...lons)+Math.min(...lons))/2;
        const len=gpx.tracks[0].distance["total"];
        const ascent=gpx.tracks[0].elevation["max"]-gpx.tracks[0].elevation["min"];
        const geopos=await points.getGeoAreaPoint(coors[0][0],coors[0][1]);
        console.log("Got position", geopos);
        let startPoint,endPoint;
        if(coors[0][0]===coors[coors.length-1][0] && coors[0][1]===coors[coors.length-1][1]){
            startPoint=await pointsdao.insertPoint("Point of hike "+name,coors[0][0],coors[0][1],gpx.tracks[0].points[0]["ele"],geopos,"hikePoint","Default starting and arrival point of hike "+name);
            endPoint=startPoint;
        }
        else{
            startPoint=await pointsdao.insertPoint("Point of hike "+name,coors[0][0],coors[0][1],gpx.tracks[0].points[0]["ele"],geopos,"hikePoint","Default starting point of hike "+name);
            const geoposend=await points.getGeoAreaPoint(coors[coors.length-1][0],coors[coors.length-1][1]);
            console.log("Got position end", geopos);
            endPoint=await pointsdao.insertPoint("Point of hike "+name,coors[coors.length-1][0],coors[coors.length-1][1],gpx.tracks[0].points[coors.length-1]["ele"],geoposend,"hikePoint","Default arrival point of hike "+name);
        }
        console.log("Finished putting points, start",startPoint,", end",endPoint);
        await hikesdao.newHike(name,user.username,len/1000,(len/1000)/2,ascent,desc,difficulty.toUpperCase(),startPoint,endPoint,coors,centerlat,centerlon,Math.max(...lats),Math.max(...lons),Math.min(...lats),Math.min(...lons));
    } catch (error) {
        console.log("Error in services newhike",error);
        throw {status:error.status,message:error.message};
    }
}

const hikes={newHike};
module.exports= hikes;