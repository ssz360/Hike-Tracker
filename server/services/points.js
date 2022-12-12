const fetch=require('node-fetch');
const hikesdao=require('../dao/hikes');
const pointsdao=require('../dao/points');
const OSMELAPI='https://api.open-elevation.com/api/v1/lookup?';

const getGeoAreaPoint=async(lat,lng,errs)=>{
    console.log("Getting geo area point for",lat,lng,errs);
    if(errs) checkLatitudeLongitude(lat,lng);
    const res=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
    const ret=await res.json();
    if(res.ok){
        if(ret.error) throw {status:422,message:ret.error};
        const geopos={province:"",region:"",country:""}
        if(ret.address.county!==undefined) geopos.province=ret.address.county;
        if(ret.address.state!==undefined) geopos.region=ret.address.state;
        if(ret.address.country!==undefined) geopos.country=ret.address.country;
        return geopos;
    }
    else throw {status:res.status,message:ret};
}

const getAltitudePoint=async(lat,lng,errs)=>{
    console.log("Getting altitude point for",lat,lng,errs);
    if(errs)   checkLatitudeLongitude(lat,lng);
    const res=await fetch(OSMELAPI+'locations='+lat+','+lng);
    console.log("Got response and have res.status",res.status,"CALLING ",OSMELAPI+'locations='+lat+','+lng);
    const ret=await res.json();
    console.log("Reply is ",ret);
    if(res.ok){
        if(ret.error) throw {status:422,message:ret.error};
        else if(ret.results) return ret.results[0].elevation;
        else throw {status:404,message:"No result was found"};
    }
    else    throw {status:res.status,message:ret.error};
}

const checkLatitudeLongitude=(lat,lng)=>{
    if(!isFinite(lat) || !isFinite(lng)) throw {status:422,message:"Bad parameters"};
    if((lat<-90 || lat>90) && (lng<-180 || lng>180)) throw {status:422,message:"Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees"};
    else if(lat<-90 || lat>90) throw {status:422,message:"Invalid latitude, it should be between -90 and 90 degrees"}
    else if(lng<-180 || lng>180) throw {status:422,message:"Invalid longitude, it should be between -180 and 180 degrees"}
}


const getGeoAndLatitude=async (lat,lng)=>{
    try {
        checkLatitudeLongitude(lat,lng);
        const res={altitude:undefined,geopos:undefined};
        res.altitude=await getAltitudePoint(lat,lng,false);
        res.geopos=await getGeoAreaPoint(lat,lng,false);
        console.log("Got geo and latitude now response is",res);
        return res;
    } catch (error) {
        throw error;
    }
}

const linkableEndPoints=async (hikeId,user)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link points to a hike"};
        else if(!isFinite(hikeId)) throw {status:422,message:"Hike id should be an integer"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        const ret=await pointsdao.linkableEndPoints(hike.endPoint.coordinates[0],hike.endPoint.coordinates[1],hike.endPoint.id,hike.Name);
        return ret;
    } catch (error) {
        console.log("Error in arrival points",error);
        throw {status:error.status,message:error.message};
    }
}

const linkableStartPoints=async (hikeId,user)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link points to a hike"};
        else if(!isFinite(hikeId)) throw {status:422,message:"Hike id should be an integer"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        const ret=await pointsdao.linkableStartPoints(hike.startPoint.coordinates[0],hike.startPoint.coordinates[1],hike.startPoint.id,hike.Name);
        return ret;
    } catch (error) {
        console.log("Error in linkable starting points",error);
        throw {status:error.status,message:error.message};
    }
}

const getImages=async pointId=>{
    try {
        if(!isFinite(pointId)) throw {status:422,message:"Bad parameters"};
        const ret=await pointsdao.getImages(parseInt(pointId));
        return ret;
    } catch (error) {
        console.log("Error @ get images",error);
        throw {status:error.status,message:error.message};
    }
}

const linkHut=async (user,body)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link a hut to a hike"};
        else if(!isFinite(body.hikeId) || !isFinite(body.hutId)) throw {status:422,message:"Bad parameters in the body, hike id and hut id should be numbers"};
        await pointsdao.linkPointToHike(parseInt(body.hikeId),parseInt(body.hutId));
    } catch (error) {
        throw {status:error.status,message:error.message};   
    }
}


const unlinkHut=async (user,body)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't unlink a hut to a hike"};
        else if(!isFinite(body.hikeId) || !isFinite(body.hutId)) throw {status:422,message:"Bad parameters in the body, hike id and hut id should be numbers"};
        await pointsdao.unlinkPointFromHike(parseInt(body.hikeId),parseInt(body.hutId));
    } catch (error) {
        throw {status:error.status,message:error.message};   
    }
}


const linkableHuts=async (hikeId,user)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link huts to a hike"};
        else if(!isFinite(hikeId)) throw {status:422,message:"The hike identifier should be an integer"};
        const ret=await pointsdao.linkableHuts(parseInt(hikeId));
        return ret;
    } catch (error) {
        console.log("Error in linkable huts",error);
        throw {status:error.status,message:error.message};
    }
}

const points={getGeoAreaPoint,getAltitudePoint,linkableEndPoints,linkableStartPoints,getImages,getGeoAndLatitude,linkHut,unlinkHut,linkableHuts};

module.exports=points;

