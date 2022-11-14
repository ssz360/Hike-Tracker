const url='http://localhost:3001/api/';

const getHikes=async ()=>{
    const res=await fetch(url+'hikes');
    const hikes=await res.json();
    if(res.ok)  return hikes.map(h=>new Hike);
    else throw res.status;
}


const api={};
export default api;