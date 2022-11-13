const APIURL = new URL('http://localhost:3001/api/');

async function insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate) {
    return new Promise((resolve, reject) => {
        const thisURL = "huts";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({name : name, country: country, numberOfGuests: numberOfGuests, numberOfBedrooms: numberOfBedrooms, coordinate: coordinate}),
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

const API ={insertHut}
export default API;