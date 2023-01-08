import Hike from "./hike";
import Hut from "./hut";
import Point from "./point";

const APIURL = new URL('http://localhost:3001/api/');

const APIBASE='http://localhost:3001/api/';

const OSMELAPI='https://api.open-elevation.com/api/v1/lookup?';

const register=async(username,password, name, surname, phone)=>{
    const res=await fetch(APIBASE+'register',{
        method:'POST',
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({username:username, password:password, first_name: name, last_name: surname, phone: phone}),
        credentials:"include"
    });
    const usr=await res.json();
    //console.log(usr);
    if(res.ok) return usr;
    else throw usr;
}

const login=async(username,password)=>{
    const res=await fetch(APIBASE+'login',{
        method:'POST',
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({username:username,password:password}),
        credentials:"include"
    });
    const emp=await res.json();
    if(res.ok) return emp;
    else throw emp;
}

/*const getHikes=async ()=>{
    const res=await fetch(APIBASE+'hikes');
    const hikes=await res.json();
    if(res.ok)  return hikes.map(h=>new Hike);
    else throw res.status;
}*/



const logout=async()=>{
    const res=await fetch(APIBASE+'logout',{
        method:"DELETE",
        headers:{
            "Content-type": "application/json"
        },
        credentials:"include"
    });
    if(res.ok) return;
    else{
        const ret=await res.json();
        throw ret;
    }
}

async function getParkings() {
    const response = await fetch(APIBASE+'parkings');
    const pks = await response.json();
    if(response.ok) return pks;
    else throw pks;
};

async function addParking(pk) {
  const response = await fetch(APIBASE+'parking',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(pk)
  });
  if(response.ok) return;
  else throw pk;
};

async function getPreferences() {
    const response = await fetch(APIBASE+'preferences',{credentials:"include"});
    if(response.ok) {
        const prefs = await response.json();
        return prefs;
    }
    else if(response.status===404) {
        console.log("404 non trovato")
        const prefs = {
            "MinLength": 0,
            "MaxLength": 40,
            "MinAscent": 0,
            "MaxAscent": 4000,
            "MinTime": 0,
            "MaxTime": 24
        };
        return prefs;
    }
    else {
        const prefs = await response.json();
        throw prefs;
    };
};

async function addPreferences(prefs) {
  const response = await fetch(APIBASE+'preferences',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:"include",
    body:JSON.stringify(prefs)
  });
  if(response.ok) return;
  else throw prefs;
};

async function insertHut(name, description, country, numberOfBedrooms, coordinate, phone, email, website) {
    return new Promise((resolve, reject) => {
        const thisURL = "huts";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({name, description, country, numberOfBedrooms, coordinate, phone, email, website}),
        })
            .then((response) => {
                if (response.ok) {
                    resolve(response.json())
                } else {
                    response.json()
                        .then((message) => { reject(message); })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ error: "Cannot communicate with the server. " }));
    });
}

async function getHikesList() {
    return new Promise((resolve, reject) => {
        fetch(new URL("hikes", APIURL))
            .then((response) => {
                if (response.ok) {
                    response.json().then(ret=>{
                        const arr=[];ret.forEach(h=>arr.push(new Hike(h.IDHike,h.Name,h.Author,h.Length,h.Ascent,h.Difficulty,h.ExpectedTime,h.startPoint,h.endPoint,h.referencePoints,h.Description,h.huts,h.center)));
                        //console.log("HIKES NO FILTERING",arr,"RECEIVED FROM TEHRE",ret);
                        resolve(arr);
                    });
                } else {
                    //console.log("Error in gethikeslist");
                    response.json()
                        .then((message) => { reject(message); })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ error: "Cannot communicate with the server. " }));
    });
}

async function getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, area) {
    return new Promise((resolve, reject) => {
        const thisURL = "hikes";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({lengthMin : lengthMin, lengthMax : lengthMax, expectedTimeMin : expectedTimeMin, 
                expectedTimeMax : expectedTimeMax, ascentMin : ascentMin, ascentMax : ascentMax, difficulty : difficulty,area: area}),
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then(ret=>{
                        const arr=[];ret.forEach(h=>arr.push(new Hike(h.id,h.name,h.author,h.length,h.ascent,h.difficulty,h.expectedTime,h.startPoint,h.endPoint,h.referencePoints,h.description,h.huts,h.center)));
                        //console.log("RETURNING NEW ARR",arr);
                        resolve(arr);
                    });
                } else {
                    response.json()
                        .then((msg) => { reject({status:response.status,message:msg}) })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ status:503, error: "Cannot communicate with the server. " }));
    });
}

const getHikersHikesList= async (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, area)=>{
    //console.log("IN GET **HIKERS** HIKES LIST WITH,",lengthMin,lengthMax,expectedTimeMin,expectedTimeMax,ascentMin,ascentMax,difficulty,area)
    const res=await fetch('http://localhost:3001/api/user/hikes',{
        credentials:"include",
        method:"POST",
        headers:{
                "Content-type": "application/json"
        },
        body: JSON.stringify({lengthMin : lengthMin, lengthMax : lengthMax, expectedTimeMin : expectedTimeMin, 
                expectedTimeMax : expectedTimeMax, ascentMin : ascentMin, ascentMax : ascentMax, difficulty : difficulty,area: area})
    });
    const ret=await res.json();
    if(res.ok){
        //console.log("RETURNED VALUE IS",ret);
        const arr=[];ret.forEach(h=>arr.push(new Hike(h.id,h.name,h.author,h.length,h.ascent,h.difficulty,h.expectedTime,h.startPoint,h.endPoint,h.referencePoints,h.description,h.coordinates,h.center,h.bounds)));
        //console.log("Returning",arr);
        return arr;
    }
    else throw {status:res.status,message:ret};
}

const addHike= async (file,name,desc,difficulty)=>{
    const data=new FormData();
    data.append('file',file);
    data.append('name',name);
    data.append('description',desc);
    data.append('difficulty',difficulty);
    //console.log("Adding a new hike with formdata",data);
    const res=await fetch('http://localhost:3001/api/newHike',{
        method:'POST',
        credentials:"include",
        body: data
    });
    //console.log("Finished the new hike query with res.status",res.status);
    if(res.ok) return;
    else{
        const ret=await res.json();
        throw ret;
    }
}

const getHikeMap=async id=>{
    //console.log("IN GETHIKEMAP FOR ",id)
    const res=await fetch(APIBASE+'hikes/'+id+'/map',{
        credentials:"include"
    });
    const ret=await res.json();
    //console.log("RECEIVED",ret);
    if(res.ok) return ret;
    else throw ret;
}

const getUserPerformance = async () => {
	const response = await fetch(APIBASE + "preferences", {
		credentials: "include"
	});
	const res = await response.json();
	if (response.ok) return res;
	else throw res;
};

const isLogged=async ()=>{
    const res=await fetch(APIBASE+'logged',{
        credentials:"include"
    });
    const usr=await res.json();
    if(res.ok) return usr;
    else throw res.status;
}

async function getHutsListWithFilters(name, country, numberOfBedrooms, geographicalArea) {
    return new Promise((resolve, reject) => {
        const thisURL = "huts/list";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({name: name, country: country, numberOfBedrooms: numberOfBedrooms, geographicalArea: geographicalArea}),
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then(ret=>{
                        const arr=[];ret.forEach(h=>arr.push(new Hut(h.IDPoint, h.Name, h.Coordinates, h.GeographicalArea,
                            h.Country, h.NumberOfBedrooms, h.Phone, h.Email, h.Website )));
                        resolve(arr);
                    });
                } else {
                    response.json()
                        .then((msg) => { reject({status:response.status,message:msg}) })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ status:503, error: "Cannot communicate with the server. " }));
    });
}

const getPointsInBounds=async (bounds,startPoint,endPoint)=>{
    const res=await fetch(APIBASE+'pointsInBounds',{
        credentials:"include",
        method:'POST',
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify({bounds:bounds,startPointCoordinates:startPoint.coordinates,endPointCoordinates:endPoint.coordinates})
    });
    const points=await res.json();
    //console.log("Received points",points);
    if(res.ok) return points.map(p=>new Point(p.id,p.name,p.coordinates,p.geographicalArea,p.typeOfPoint));
    else throw res.status;
}

const getHutsInBounds=async (bounds,startPoint,endPoint)=>{
    const res=await fetch(APIBASE+'hutsInBounds',{
        credentials:"include",
        method:'POST',
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify({bounds:bounds,startPointCoordinates:startPoint.coordinates,endPointCoordinates:endPoint.coordinates})
    });
    const points=await res.json();
    console.log("Received points",points);
    if(res.ok) return points.map(p=>new Point(p.id,p.name,p.coordinates,p.geographicalArea,p.typeOfPoint));
    else throw res.status;
}



const linkStartArrival=async (hikeId,startPointId,endPointId)=>{
    const res=await fetch(APIBASE+'updateStartEndPoint',{
        credentials:"include",
        method:'POST',
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify({IDHike:hikeId, StartPoint:startPointId, EndPoint:endPointId})
    });
    if(res.ok) return;
    else{
        const err=await res.json();
        throw err;
    }
}


const linkHut=async (hikeId,hutId,link)=>{
    const res=await fetch(APIBASE+'hikes/linkHut',{
        credentials:"include",
        method:link?'POST':'DELETE',
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify({hikeId:hikeId, hutId:hutId})
    });
    if(res.ok) return;
    else{
        const err=await res.json();
        throw err;
    }
}

const getHikesInBounds=async bounds=>{
    const res=await fetch(APIBASE+'hikesinbounds',{
        credentials:"include",
        method:'POST',
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify({bounds:bounds})
    });
    const ret=await res.json();
    //console.log("\t\tRECEIVED FROM GET HIKES IN BOUNDS ",ret);
    if(res.ok) return ret.map(h=>({id:h.id,coordinates:h.coordinates}));
    else    throw ret;
}

const getLinkableHuts=async id=>{
    const res=await fetch(APIBASE+'hikes/'+id+'/linkablehuts',{
        credentials:"include"
    });
    const ret=await res.json();
    //console.log("\t\tRECEIVED FROM GET HIKES IN BOUNDS ",ret);
    if(res.ok) return ret.map(h=>new Point(h.id,h.name,h.coordinates,h.geographicalArea,h.typeOfPoint));
    else    throw ret;
}

const getLinkableStartPoints=async id=>{
    const res=await fetch(APIBASE+'hikes/'+id+'/linkableStartPoints',{
        credentials:"include"
    });
    const ret=await res.json();
    if(res.ok) return ret.map(h=>new Point(h.id,h.name,h.coordinates,h.geographicalArea,h.typeOfPoint));
    else throw ret;
}

const getLinkableEndPoints=async id=>{
    const res=await fetch(APIBASE+'hikes/'+id+'/linkableEndPoints',{
        credentials:"include"
    });
    const ret=await res.json();
    if(res.ok) return ret.map(h=>new Point(h.id,h.name,h.coordinates,h.geographicalArea,h.typeOfPoint));
    else throw ret;
}

const getElevation=async (lat,lng)=>{
    const res=await fetch(OSMELAPI+'locations='+lat+','+lng);
    const ret=await res.json();
    if(res.ok) return ret.results[0].elevation;
    else throw ret;
}
//'/api/hikes/:hikeId/referencePoint'

const addReferencePoint=async (hike,name,pointCoord,description,images)=>{
    const data=new FormData();
    data.append('name',name);
    data.append('description',description);
    data.append('latitude',pointCoord[0]);
    data.append('longitude',pointCoord[1]);
    images.forEach(i=>data.append('images',i));
    console.log("Adding a new reference point with formdata",data,"hike",hike,"name",name,"coords",pointCoord,"desc",description,"images",images);
    const res=await fetch(APIBASE+'hikes/'+hike+'/referencePoint',{
        method:'POST',
        credentials:"include",
        body: data
    });
    if(res.ok) return;
    else{
        const ret=await res.json();
        throw ret;
    }
}

const getImagesPoint=async pointId=>{
    const res=await fetch(APIBASE+'point/'+pointId+'/images',{
        credentials:"include"
    });
    const ret=await res.json();
    if(res.ok) return ret.map(i=>({name:i.name,url:'http://localhost:3001/images/'+i.path}));
    else throw ret;
}


const api = {
	login,
	logout,
	getPointsInBounds,
	linkStartArrival,
	register,
	getParkings,
	addParking,
    getPreferences,
    addPreferences,
	insertHut,
	getHikesList,
	getHikersHikesList,
	getUserPerformance,
	addHike,
	getHikesListWithFilters,
	getHikeMap,
	isLogged,
	getHutsListWithFilters,
	linkHut,
	getHutsInBounds,
	getHikesInBounds,
	getLinkableHuts,
	getLinkableStartPoints,
	getLinkableEndPoints,
	getElevation,
	addReferencePoint,
	getImagesPoint
};

export default api;