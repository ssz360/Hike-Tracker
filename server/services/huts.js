const points=require('./points');
const pointsdao=require('../dao/points');
const hutsdao=require('../dao/huts');


const addHut=async (user,body,images)=>{
    try {
        if(user.type!=="localGuide") throw {status:401,message:"This type of user can't add a new hut"};
        else if(!isFinite(body.latitude) || !isFinite(body.longitude) || !isFinite(body.numberOfBedrooms) || typeof(body.name)!=="string" || typeof(body.description)!=="string"
            || typeof(body.email)!=='string' || (body.website!==undefined && typeof(body.website)!=='string')) throw {status:422,message:"Bad parameters"};
        if(images.length===0) throw {status:422,message:"To insert a new hut you must provide at least one image"};
        const geodata = await points.getGeoAndLatitude(parseFloat(body.latitude),parseFloat(body.longitude));
        const ret = await hutsdao.insertHut(body.name, body.description, parseInt(body.numberOfBedrooms), [parseFloat(body.latitude),parseFloat(body.longitude)], geodata.geopos, geodata.altitude, body.phone, body.email, body.website);
        for(const i of images){
            await pointsdao.insertImageForPoint(ret,i);
        }
        return ret;
    } catch (error) {
        throw {status:error.status,message:error.message};
    }
}

const huts={addHut};

module.exports=huts;