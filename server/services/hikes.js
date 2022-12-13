const hikesdao=require('../dao/hikes');
const gpxParser = require('gpxparser');
const pointsdao=require('../dao/points');
const points=require('./points');
const newHike=async (body,user,file)=>{
    try {
        if(user.type!=="localGuide")    throw {status:401,message:"This type of user can't describe a new hike"};
        if(typeof(body.name)!=="string" || typeof(body.description)!=="string" || typeof(body.difficulty)!=="string") throw {status:422,message:"Bad parameters"};
        const gpx = new gpxParser();gpx.parse(file.buffer.toString());
        if(gpx.tracks[0]===undefined) throw {status:422,message:"The gpx file provided is not a valid one"}
        const coors=[];
        gpx.tracks[0].points.forEach(p =>coors.push([p["lat"],p["lon"]]));
        const lats=coors.map(p=>p[0]);const lons=coors.map(p=>p[1]);
        const centerlat=(Math.max(...lats)+Math.min(...lats))/2;
        const centerlon=(Math.max(...lons)+Math.min(...lons))/2;
        const len=gpx.tracks[0].distance["total"];
        const ascent=gpx.tracks[0].elevation["max"]-gpx.tracks[0].elevation["min"];
        const geopos=await points.getGeoAreaPoint(coors[0][0],coors[0][1],true);
        let startPoint,endPoint;
        if(coors[0][0]===coors[coors.length-1][0] && coors[0][1]===coors[coors.length-1][1]){
            startPoint=await pointsdao.insertPoint("Point of hike "+body.name,coors[0][0],coors[0][1],gpx.tracks[0].points[0]["ele"],geopos,"hikePoint","Default starting and arrival point of hike "+body.name);
            endPoint=startPoint;
        }
        else{
            startPoint=await pointsdao.insertPoint("Point of hike "+body.name,coors[0][0],coors[0][1],gpx.tracks[0].points[0]["ele"],geopos,"hikePoint","Default starting point of hike "+body.name);
            const geoposend=await points.getGeoAreaPoint(coors[coors.length-1][0],coors[coors.length-1][1],true);
            endPoint=await pointsdao.insertPoint("Point of hike "+body.name,coors[coors.length-1][0],coors[coors.length-1][1],gpx.tracks[0].points[coors.length-1]["ele"],geoposend,"hikePoint","Default arrival point of hike "+body.name);
        }
        await hikesdao.newHike(body.name,user.username,len/1000,(len/1000)/2,ascent,body.description,body.difficulty.toUpperCase(),startPoint,endPoint,coors,centerlat,centerlon,Math.max(...lats),Math.max(...lons),Math.min(...lats),Math.min(...lons));
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}

const hikesInBounds=async (maxLat,maxLng,minLat,minLng)=>{
    try {
        if(!isFinite(maxLat) || !isFinite(maxLng) || !isFinite(minLat) || !isFinite(minLng)) throw {status:422,message:"Bad parameters"};
        const ret=await hikesdao.hikesInBounds(parseFloat(maxLat),parseFloat(maxLng),parseFloat(minLat),parseFloat(minLng));
        return ret;
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}

const addReferencePoint=async (hikeId,files,body,user)=>{
    try {
        console.log("In add ref point with hikeid",hikeId,"FILES",files,"body",body,"user",user);
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link points to a hike"};
        else if(!isFinite(hikeId) || !isFinite(body.latitude) || !isFinite(body.longitude) || typeof(body.name)!=="string" || typeof(body.description)!=="string") throw {status:422,message:"Bad parameters"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        if(user.username!==hike.author) throw {status:401,message:"This local guide doesn't have the rigths to update this hike reference points"};
        const geoData=await points.getGeoAndLatitude(body.latitude,body.longitude);
        const pointId=await pointsdao.insertPoint(body.name,parseFloat(body.latitude),parseFloat(body.longitude),geoData.altitude,geoData.geopos,"referencePoint",body.description);
        await pointsdao.linkPointToHike(parseInt(hikeId),pointId);
        for(const i of files){
            await pointsdao.insertImageForPoint(pointId,i);
        }
    } catch (error) {
        console.log("Error in add ref points",error);
        throw {status:error.status,message:error.message};
    }
}

const getMap=async id=>{
    try {
        if(!isFinite(id)) throw {status:422,message:"Id should be an integer"};
        const ret = await hikesdao.getHikeMap(parseInt(id));
        return ret;
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}

const hikes={newHike,hikesInBounds,addReferencePoint,getMap};
module.exports= hikes;