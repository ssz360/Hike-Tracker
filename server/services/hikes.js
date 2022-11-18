const hikesdao=require('../dao/hikes');
const usersdao=require('../dao/users');
const gpxParser = require('gpxparser');
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
        const lats=coors.map(p=>p[0]);const lons=coors.map(p=>p[1]);
        const center=JSON.stringify([(Math.max(...lats)+Math.min(...lats))/2,(Math.max(...lons)+Math.min(...lons))/2]);
        const len=gpx.tracks[0].distance["total"];
        const ascent=gpx.tracks[0].elevation["max"]-gpx.tracks[0].elevation["min"];
        await hikesdao.newHike(name,user.username,len,ascent,desc,difficulty.toUpperCase(),JSON.stringify(coors[0]),JSON.stringify(coors[coors.length-1]),"",JSON.stringify(coors),center,Math.max(...lats),Math.max(...lons),Math.min(...lats),Math.min(...lons));
    } catch (error) {
        //console.log("Error in services newhike",error);
        throw {status:error.status,message:error.message};
    }
}

const hikes={newHike};
module.exports= hikes;