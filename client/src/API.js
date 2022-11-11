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


const API ={getHikesList, getHikesListWithFilters}
export default API;