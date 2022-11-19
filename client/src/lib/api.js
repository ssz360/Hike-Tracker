const APIBASE='http://localhost:3001/api/';

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
    console.log(usr);
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

const insertNewHut = async (name, country, numberOfGuests, numberOfBedrooms, coordinates) => {
    JSON.stringify(name, country, numberOfGuests, numberOfBedrooms, coordinates);
    const res = await fetch(APIBASE + "huts", {
		method: "POST",
		headers: {
			"Content-type": "application/json"
		},
        body: JSON.stringify({ name, country, numberOfGuests, numberOfBedrooms, coordinates }),
		credentials: "include"
	});
    if (res.ok) return await res.json();
    else { 
        console.log(await res.json());
    }
}

const api={login, logout, register, getParkings, addParking,insertNewHut};
export default api;