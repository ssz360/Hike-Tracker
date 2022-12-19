const fetch=require('node-fetch');
const hikesdao=require('../dao/hikes');
const pointsdao=require('../dao/points');
const OSMELAPI='https://api.open-elevation.com/api/v1/lookup?';

const getGeoAreaPoint=async(lat,lng,errs)=>{
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
    if(errs)   checkLatitudeLongitude(lat,lng);
    const res=await fetch(OSMELAPI+'locations='+lat+','+lng);
    const ret=await res.json();
    if(res.ok){
        if(ret.error) throw {status:422,message:ret.error};
        else if(ret.results) return ret.results[0].elevation;
        else throw {status:404,message:"No result was found"};
    }
    else    throw {status:res.status,message:ret.error};
}

const checkLatitudeLongitude=(lat,lng)=>{
    if(!isFinite(lat) || !isFinite(lng)) throw {status:422,message:"Bad parameters"};
    if(lat<-90 || lat>90 || lng<-180 || lng>180) throw {status:422,message:"Invalid coordinates, latitude should be between -90 and 90 degrees and longitude should be between -180 and 180 degrees"};
    //else if(lat<-90 || lat>90) throw {status:422,message:"Invalid latitude, it should be between -90 and 90 degrees"}
    //else if(lng<-180 || lng>180) throw {status:422,message:"Invalid longitude, it should be between -180 and 180 degrees"}
}


const getGeoAndLatitude=async (lat,lng)=>{
    try {
        checkLatitudeLongitude(lat,lng);
        const res={altitude:undefined,geopos:undefined};
        res.altitude=await getAltitudePoint(lat,lng,false);
        res.geopos=await getGeoAreaPoint(lat,lng,false);
        return res;
    } catch (error) {
        throw error;
    }
}

const linkableEndPoints=async (user,hikeId)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link points to a hike"};
        else if(!isFinite(hikeId)) throw {status:422,message:"Hike id should be an integer"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        const ret=await pointsdao.linkableEndPoints(hike.endPoint.coordinates[0],hike.endPoint.coordinates[1],hike.endPoint.id,hike.Name);
        return ret;
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}

const linkableStartPoints=async (user,hikeId)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link points to a hike"};
        else if(!isFinite(hikeId)) throw {status:422,message:"Hike id should be an integer"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        const ret=await pointsdao.linkableStartPoints(hike.startPoint.coordinates[0],hike.startPoint.coordinates[1],hike.startPoint.id,hike.Name);
        return ret;
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}

const getImages=async pointId=>{
    try {
        if(!isFinite(pointId)) throw {status:422,message:"Bad parameters"};
        const ret=await pointsdao.getImages(parseInt(pointId));
        return ret;
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}

const linkHut=async (user,hikeId,body)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link a hut to a hike"};
        else if(!isFinite(hikeId) || !isFinite(body.hutId)) throw {status:422,message:"Bad parameters, hike id and hut id should be numbers"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        if(user.username!==hike.author) throw {status:401,message:"This local guide doesn't have the rigths to update this hike"};
        const linkable=await linkableHuts(user,hikeId);
        if(!linkable.some(h=>h.id===body.hutId)) throw {status:422,message:"This hut is not linkable to this hike"};
        else if(hike.huts.some(h=>h.id===body.hutId)) throw {status:422,message:"This hut is already linked to this hike"};
        await pointsdao.linkPointToHike(parseInt(hikeId),parseInt(body.hutId));
    } catch (error) {
        throw {status:error.status,message:error.message};   
    }
}


const unlinkHut=async (user,hikeId,body)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't unlink a hut to a hike"};
        else if(!isFinite(hikeId) || !isFinite(body.hutId)) throw {status:422,message:"Bad parameters, hike id and hut id should be numbers"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        if(user.username!==hike.author) throw {status:401,message:"This local guide doesn't have the rigths to update this hike"};
        if(!hike.huts.some(h=>h.id===body.hutId)) throw {status:422,message:"This hut is not already linked to this hike"};
        await pointsdao.unlinkPointFromHike(parseInt(hikeId),parseInt(body.hutId));
    } catch (error) {
        throw {status:error.status,message:error.message};   
    }
}


const linkableHuts=async (user,hikeId)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't link huts to a hike"};
        else if(!isFinite(hikeId)) throw {status:422,message:"The hike identifier should be an integer"};
        const ret=await pointsdao.linkableHuts(parseInt(hikeId));
        return ret;
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}


const linkStart=async (user,hikeId,body)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't update the starting point of a hike"};
        else if(!isFinite(hikeId) || !isFinite(body.pointId)) throw {status:422,message:"Bad parameters, hike id and point id should be numbers"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        if(user.username!==hike.author) throw {status:401,message:"This local guide doesn't have the rigths to update this hike"};
        const linkableStartP=await linkableStartPoints(user,hikeId);
        if(!linkableStartP.some(p=>p.id===parseInt(body.pointId))) throw {status:422,message:"This point is not linkable as a start point for this hike"};
        await hikesdao.updateStartingArrivalPoint(parseInt(hikeId),parseInt(body.pointId),undefined);
    } catch (error) {
        throw error;
    }
}

const linkEnd=async (user,hikeId,body)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't update the arrival point of a hike"};
        else if(!isFinite(hikeId) || !isFinite(body.pointId)) throw {status:422,message:"Bad parameters, hike id and point id should be numbers"};
        const hike=await hikesdao.getHike(parseInt(hikeId));
        if(user.username!==hike.author) throw {status:401,message:"This local guide doesn't have the rigths to update this hike"};
        const linkableEndP=await linkableEndPoints(user,hikeId);
        if(!linkableEndP.some(p=>p.id===parseInt(body.pointId))) throw {status:422,message:"This point is not linkable as an arrival point for this hike"};
        await hikesdao.updateStartingArrivalPoint(parseInt(hikeId),undefined,parseInt(body.pointId));
    } catch (error) {
        throw error;
    }
}

const points={getGeoAreaPoint,getAltitudePoint,linkableEndPoints,linkableStartPoints,getImages,getGeoAndLatitude,linkHut,unlinkHut,linkableHuts,linkStart,linkEnd};

module.exports=points;