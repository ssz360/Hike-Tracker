const fetch=require('node-fetch');
const OSMELAPI='https://api.open-elevation.com/api/v1/lookup?';

const getGeoAreaPoint=async(lat,lng)=>{
    const res=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
    const ret=await res.json();
    if(res.ok){
        console.log("Position in api is ",ret);
        const geopos={province:"",region:"",country:""}
        if(ret.address.county!==undefined) geopos.province=ret.address.county;
        if(ret.address.state!==undefined) geopos.region=ret.address.state;
        if(ret.address.country!==undefined) geopos.country=ret.address.country;
        return geopos;
    }
    else throw {status:res.status,message:ret};
}

const getAltitudePoint=async(lat,lng)=>{
    const res=await fetch(OSMELAPI+'locations='+lat+','+lng);
    const ret=await res.json();
    if(res.ok) return ret.results[0].elevation;
    else throw {status:res.status,message:ret};
}

const points={getGeoAreaPoint,getAltitudePoint};

module.exports=points;

