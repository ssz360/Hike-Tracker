const APIURL = new URL('http://localhost:3001/api/');
const APIBASE='http://localhost:3001/api/';

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
const api={};
export default api;