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
                        const arr=[];ret.forEach(h=>arr.push(new Hike(h.IDHike,h.Name,"",h.Length,h.Ascent,h.Difficulty,"",h.StartPoint,h.EndPoint,h.ReferencePoints,h.Description,[[0,0]],[0,0])));
                        resolve(arr);
                    });
                } else {
                    console.log("Error in gethikeslist");
                    response.json()
                        .then((message) => { reject(message); })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ error: "Cannot communicate with the server. " }));
    });
}

async function getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty) {
    return new Promise((resolve, reject) => {
        const thisURL = "hikes";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({lengthMin : lengthMin, lengthMax : lengthMax, expectedTimeMin : expectedTimeMin, 
                expectedTimeMax : expectedTimeMax, ascentMin : ascentMin, ascentMax : ascentMax, difficulty : difficulty}),
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then(ret=>{
                        const arr=[];ret.forEach(h=>arr.push(new Hike(h.IDHike,h.Name,"",h.Length,h.Ascent,h.Difficulty,"",h.StartPoint,h.EndPoint,h.ReferencePoints,h.Description,[[0,0]],[0,0])));
                        resolve(arr);
                    });
                } else {
                    response.json()
                        .then((message) => { reject(message); })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ error: "Cannot communicate with the server. " }));
    });
}

const getHikersHikesList= async ()=>{
    const res=await fetch('http://localhost:3001/api/hiker/hikes');/*,{
        credentials:"include"
    });*/
    const ret=await res.json();
    if(res.ok){
        const arr=[];ret.forEach(h=>arr.push(new Hike(h.IDHike,h.Name,"",h.Length,h.Ascent,h.Difficulty,"",h.StartPoint,h.EndPoint,h.ReferencePoints,h.Description,[[0,0]],[0,0])));
        return arr;
    }
    else throw res.status;
}

const addHike= async (file,name,desc,difficulty)=>{
    const data=new FormData();
    data.append('file',file);
    data.append('name',name);
    data.append('description',desc);
    data.append('difficulty',difficulty);
    const res=await fetch('http://localhost:3001/api/newHike',{
        method:'POST',
        body: data
    });
    const ret=await res.json();
    if(res.ok) return;
    else throw ret;
}

const API ={getHikesList,getHikesListWithFilters,getHikersHikesList,addHike,insertHut}
export default API;