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
    const emp=await res.json();
    if(res.ok) return emp;
    else throw emp;
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

const api = {login, logout, register, insertNewHut};
export default api;