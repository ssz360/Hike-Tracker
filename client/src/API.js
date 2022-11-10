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

const API ={getHikesList}
export default API;