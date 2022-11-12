import Hike from "./lib/hike";

const APIURL = new URL('http://localhost:3001/api/');

async function getHikesList() {
    return new Promise((resolve, reject) => {
        fetch(new URL("hikes", APIURL))
            .then((response) => {
                if (response.ok) {
                    resolve(response.json());
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
        const arr=[];ret.forEach(h=>arr.push(new Hike(h.id,h.name,h.author,h.length,h.ascent,h.difficulty,h.expectedTime,h.startPoint,h.endPoint,h.referencePoints,h.description,h.coordinates,h.center)));
        return arr;
    }
    else throw res.status;
}

const API ={getHikesList,getHikersHikesList}
export default API;