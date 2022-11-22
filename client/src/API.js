import Hike from "./lib/hike";

const APIURL = new URL('http://localhost:3001/api/');

async function insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate) {
    return new Promise((resolve, reject) => {
        const thisURL = "huts";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({name, country, numberOfGuests, numberOfBedrooms, coordinate}),
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
                        const arr=[];ret.forEach(h=>arr.push(new Hike(h.IDHike,h.Name,h.Author,h.Length,h.Ascent,h.Difficulty,h.ExpectedTime,h.StartPoint,h.EndPoint,h.ReferencePoints,h.Description,[[0,0]],[0,0])));
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
                        const arr=[];ret.forEach(h=>arr.push(new Hike(h.id,h.name,h.author,h.length,h.ascent,h.difficulty,h.expectedTime,h.startPoint,h.endPoint,h.referencePoints,h.description,[[0,0]],[0,0],[[0.1,0.1],[-0.1,-0.1]])));
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

const API ={getHikesList,getHikesListWithFilters,getHikersHikesList,addHike,insertHut}
export default API;