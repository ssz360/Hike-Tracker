import Hike from "./hike";
import Hut from "./hut";
import Point from "./point";

const APIURL = new URL('http://localhost:3001/api/');

const APIBASE = 'http://localhost:3001/api/';

const OSMELAPI = 'https://api.open-elevation.com/api/v1/lookup?';

const register = async (username, password, name, surname, phone) => {
    const res = await fetch(APIBASE + 'register', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password, first_name: name, last_name: surname, phone: phone }),
        credentials: "include"
    });
    const usr = await res.json();
    //console.log(usr);
    if (res.ok) return usr;
    else throw usr;
}

const login = async (username, password) => {
    const res = await fetch(APIBASE + 'login', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password }),
        credentials: "include"
    });
    const emp = await res.json();
    if (res.ok) return emp;
    else throw emp;
}

const logout = async () => {
    const res = await fetch(APIBASE + 'logout', {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        credentials: "include"
    });
    if (res.ok) return;
    else {
        const ret = await res.json();
        throw ret;
    }
}

async function getParkings() {
    const response = await fetch(APIBASE + 'parkings');
    const pks = await response.json();
    if (response.ok) return pks;
    else throw pks;
};

async function addParking(pk) {
    const response = await fetch(APIBASE + 'parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pk)
    });
    if (response.ok) return;
    else throw pk;
};

async function getPreferences() {
    const response = await fetch(APIBASE + 'preferences', { credentials: "include" });
    if (response.ok) {
        const prefs = await response.json();
        return prefs;
    }
    else if (response.status === 404) {
        console.log("404 non trovato")
        const prefs = {
            "length": 40,
            "ascent": 4000,
            "time": 15
        };
        return prefs;
    }
    else {
        const prefs = await response.json();
        throw prefs;
    };
};

async function addPreferences(prefs) {
    const response = await fetch(APIBASE + 'preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(prefs)
    });
    if (response.ok) return;
    else throw prefs;
};

async function insertHut(name, description, country, numberOfBedrooms, coordinate, phone, email, website, images) {
    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('country', country);
    data.append('numberOfBedrooms', numberOfBedrooms);
    data.append('latitude', coordinate[0]);
    data.append('longitude', coordinate[1]);
    data.append('phone', phone);
    data.append('email', email);
    data.append('website', website);
    images.forEach(i => data.append('images', i));
    return new Promise((resolve, reject) => {
        const thisURL = "huts";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            credentials: "include",
            body: data
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
                    response.json().then(ret => {
                        const arr = []; ret.forEach(h => arr.push(new Hike(h.IDHike, h.Name, h.Author, h.Length, h.Ascent, h.Difficulty, h.ExpectedTime, h.startPoint, h.endPoint, h.referencePoints, h.Description, h.huts, h.center)));
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

const getHikesFiltersQueryParams = (lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, area) => {
    let queryParams = new URLSearchParams('?');
    if (lengthMin) queryParams.append('lenMin', lengthMin);
    if (lengthMax) queryParams.append('lenMax', lengthMax);
    if (expectedTimeMin) queryParams.append('expTimeMin', expectedTimeMin);
    if (expectedTimeMax) queryParams.append('expTimeMax', expectedTimeMax);
    if (ascentMin) queryParams.append('ascMin', ascentMin);
    if (ascentMax) queryParams.append('ascMax', ascentMax);
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (area) {
        queryParams.append('centerLat', area.center.lat);
        queryParams.append('centerLng', area.center.lng);
        queryParams.append('radius', area.radius);
    }
    return queryParams.toString();
}

async function getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, area) {
    return new Promise((resolve, reject) => {
        const queryParams = getHikesFiltersQueryParams(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, area);
        fetch(APIBASE + 'hikes/filters' + (queryParams !== '' ? '?' + queryParams : ''))
            .then((response) => {
                if (response.ok) {
                    response.json().then(ret => {
                        const arr = []; ret.forEach(h => arr.push(new Hike(h.id, h.name, h.author, h.length, h.ascent, h.difficulty, h.expectedTime, h.startPoint, h.endPoint, h.referencePoints, h.description, h.huts, h.center)));
                        resolve(arr);
                    });
                } else {
                    response.json()
                        .then((msg) => { reject({ status: response.status, message: msg }) })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ status: 503, error: "Cannot communicate with the server. " }));
    });
}

const addHike = async (file, name, desc, difficulty, images) => {
    const data = new FormData();
    data.append('file', file);
    data.append('name', name);
    data.append('description', desc);
    data.append('difficulty', difficulty);
    images.forEach(i => data.append('images', i));
    const res = await fetch('http://localhost:3001/api/newHike', {
        method: 'POST',
        credentials: "include",
        body: data
    });
    if (res.ok) return;
    else {
        const ret = await res.json();
        throw ret;
    }
}

const getHikeMap = async id => {
    const res = await fetch(APIBASE + 'hikes/' + id + '/map', {
        credentials: "include"
    });
    const ret = await res.json();
    if (res.ok) return ret;
    else throw ret;
}

const getUserPerformance = async () => {
    const response = await fetch(APIBASE + "preferences", {
        credentials: "include"
    });
    const res = await response.json();
    if (response.ok) return res;
    else throw res;
};

const isLogged = async () => {
    const res = await fetch(APIBASE + 'logged', {
        credentials: "include"
    });
    const usr = await res.json();
    if (res.ok) return usr;
    else throw res.status;
}

async function getHutsListWithFilters(name, country, numberOfBedrooms, geographicalArea) {
    return new Promise((resolve, reject) => {
        const thisURL = "huts/list";
        fetch(new URL(thisURL, APIURL), {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ name: name, country: country, numberOfBedrooms: numberOfBedrooms, geographicalArea: geographicalArea }),
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then(ret => {
                        const arr = []; ret.forEach(h => arr.push(new Hut(h.IDPoint, h.Name, h.Coordinates, h.GeographicalArea,
                            h.Country, h.NumberOfBedrooms, h.Phone, h.Email, h.Website, h.Description)));
                        resolve(arr);
                    });
                } else {
                    response.json()
                        .then((msg) => { reject({ status: response.status, message: msg }) })
                        .catch(() => { reject({ error: "Cannot parse server response. " }) });
                }
            })
            .catch(() => reject({ status: 503, error: "Cannot communicate with the server. " }));
    });
}

const getHutsInBounds = async (bounds, startPoint, endPoint) => {
    const res = await fetch(APIBASE + 'hutsInBounds', {
        credentials: "include",
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ bounds: bounds, startPointCoordinates: startPoint.coordinates, endPointCoordinates: endPoint.coordinates })
    });
    const points = await res.json();
    console.log("Received points", points);
    if (res.ok) return points.map(p => new Point(p.id, p.name, p.coordinates, p.geographicalArea, p.typeOfPoint, p.description));
    else throw res.status;
}



const linkStartArrival = async (hikeId, startPointId, endPointId) => {
    const res = await fetch(APIBASE + 'hikes/' + hikeId + (startPointId ? '/startPoint' : '/endPoint'), {
        credentials: "include",
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ pointId: startPointId ? startPointId : endPointId })
    });
    if (res.ok) return;
    else {
        const err = await res.json();
        throw err;
    }
}

const linkHut = async (hikeId, hutId, link) => {
    const res = await fetch(APIBASE + 'hikes/' + hikeId + '/linkHut', {
        credentials: "include",
        method: link ? 'POST' : 'DELETE',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ hutId: hutId })
    });
    if (res.ok) return;
    else {
        const err = await res.json();
        throw err;
    }
}

const getHikesInBounds = async bounds => {
    const res = await fetch(APIBASE + 'hikes/bounds/' + bounds[0][0] + "/" + bounds[0][1] + "/" + bounds[1][0] + "/" + bounds[1][1], { credentials: "include" });
    const ret = await res.json();
    if (res.ok) return ret.map(h => ({ id: h.id, coordinates: h.coordinates }));
    else throw ret;
}

const getLinkableHuts = async id => {
    const res = await fetch(APIBASE + 'hikes/' + id + '/linkablehuts', {
        credentials: "include"
    });
    const ret = await res.json();
    if (res.ok) return ret.map(h => new Point(h.id, h.name, h.coordinates, h.geographicalArea, h.typeOfPoint, h.description));
    else throw ret;
}

const getLinkableStartPoints = async id => {
    const res = await fetch(APIBASE + 'hikes/' + id + '/linkableStartPoints', {
        credentials: "include"
    });
    const ret = await res.json();
    if (res.ok) return ret.map(h => new Point(h.id, h.name, h.coordinates, h.geographicalArea, h.typeOfPoint, h.description));
    else throw ret;
}

const getLinkableEndPoints = async id => {
    const res = await fetch(APIBASE + 'hikes/' + id + '/linkableEndPoints', {
        credentials: "include"
    });
    const ret = await res.json();
    console.log("AIUTO" + ret.map(p => p.description))
    if (res.ok) return ret.map(h => new Point(h.id, h.name, h.coordinates, h.geographicalArea, h.typeOfPoint, h.description));
    else throw ret;
}

const getElevation = async (lat, lng) => {
    const res = await fetch(OSMELAPI + 'locations=' + lat + ',' + lng);
    const ret = await res.json();
    if (res.ok) return ret.results[0].elevation;
    else throw ret;
}

const addReferencePoint = async (hike, name, pointCoord, description, images) => {
    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('latitude', pointCoord[0]);
    data.append('longitude', pointCoord[1]);
    images.forEach(i => data.append('images', i));
    console.log("Adding a new reference point with formdata", data, "hike", hike, "name", name, "coords", pointCoord, "desc", description, "images", images);
    const res = await fetch(APIBASE + 'hikes/' + hike + '/referencePoint', {
        method: 'POST',
        credentials: "include",
        body: data
    });
    if (res.ok) return;
    else {
        const ret = await res.json();
        throw ret;
    }
}

const getImagesPoint = async pointId => {
    const res = await fetch(APIBASE + 'point/' + pointId + '/images', {
        credentials: "include"
    });
    const ret = await res.json();
    if (res.ok) return ret.map(i => ({ name: i.name, url: 'http://localhost:3001/images/' + i.path }));
    else throw ret;
}

const getImagesHike = async hikeId => {
    const res = await fetch(APIBASE + 'hike/' + hikeId + '/images', {
        credentials: "include"
    });
    const ret = await res.json();
    if (res.ok) return ret.map(i => ({ name: i.name, url: 'http://localhost:3001/images/' + i.path }));
    else throw ret;
}

const startHike = async id => {
    //throw "Cannot start hike "+id;
    return;
}

const getUnfinishedHike = async () => {
    return {
        hikeId: 1,
        start: '2022-12-23 17:50:10',
        stoppedAt: '2022-12-23 17:50:10',
        stopped: false,
        secsFromLastStop: 0
    }
}

const stopResumeHike = async (stoppedAt, secsFromLastStop, stopped) => {
    return {
        hikeId: 1,
        start: '2022-12-23 17:50:10',
        'stoppedAt': stoppedAt,
        'stopped': stopped,
        secsFromLastStop: secsFromLastStop
    }
}

const api = {
    login,
    logout,
    linkStartArrival,
    register,
    getParkings,
    addParking,
    getPreferences,
    addPreferences,
    insertHut,
    getHikesList,
    getUserPerformance,
    addHike,
    getHikesListWithFilters,
    getHikeMap,
    isLogged,
    getHutsListWithFilters,
    linkHut,
    getHutsInBounds,
    getHikesInBounds,
    getLinkableHuts,
    getLinkableStartPoints,
    getLinkableEndPoints,
    getElevation,
    addReferencePoint,
    getImagesPoint,
    startHike,
    getUnfinishedHike,
    stopResumeHike,
    getImagesHike
};

export default api;