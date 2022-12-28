const hikesdao = require('../dao/hikes');
const gpxParser = require('gpxparser');
const pointsdao = require('../dao/points');
const points = require('./points');
const fs = require('fs');
const DIFFICULTIES = ['TOURIST', 'HIKER', 'PROFESSIONAL HIKER']
const DEFCENTERLAT = 0;
const DEFCENTERLNG = 0;
const DEFRADIUS = 6371;
const getHikes = async () => {
    try {
        const ret = await hikesdao.getHikesList();
        return ret;
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}

const getHikesFilters = async queries => {
    try {
        if ((queries.centerLat && !isFinite(queries.centerLat)) || (queries.centerLng && !isFinite(queries.centerLng))
            || (queries.radius && !isFinite(queries.radius)) || (queries.lenMin && !isFinite(queries.lenMin))
            || (queries.lenMax && !isFinite(queries.lenMax)) || (queries.expTimeMin && !isFinite(queries.expTimeMin))
            || (queries.expTimeMax && !isFinite(queries.expTimeMax)) || (queries.ascMin && !isFinite(queries.ascMin))
            || (queries.ascMax && !isFinite(queries.ascMax)) || (queries.difficulty && !DIFFICULTIES.includes(queries.difficulty.toUpperCase()))) throw { status: 422, message: "Bad parameters" };
        const ret = await hikesdao.getHikesListWithFilters(queries.lenMin ? parseFloat(queries.lenMin) : undefined, queries.lenMax ? parseFloat(queries.lenMax) : undefined,
            queries.expTimeMin ? parseFloat(queries.expTimeMin) : undefined, queries.expTimeMax ? parseFloat(queries.expTimeMax) : undefined,
            queries.ascMin ? parseFloat(queries.ascMin) : undefined, queries.ascMax ? parseFloat(queries.ascMax) : undefined, queries.difficulty ? queries.difficulty.toUpperCase() : undefined,
            queries.centerLat ? parseFloat(queries.centerLat) : DEFCENTERLAT, queries.centerLng ? parseFloat(queries.centerLng) : DEFCENTERLNG,
            queries.radius ? parseFloat(queries.radius) : DEFRADIUS);
        return ret;
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}

const newHike = async (user, body, file, images) => {
    try {
        console.log('NEW HIKE   user', user, 'body', body, 'gpx file', file, 'images', images);
        if (user.type !== "localGuide") throw { status: 401, message: "This type of user can't describe a new hike" };
        if (typeof (body.name) !== "string" || typeof (body.description) !== "string" || typeof (body.difficulty) !== "string") throw { status: 422, message: "Bad parameters" };
        if (images.length === 0) throw { status: 422, message: "To insert a new hike you must provide at least one image!" };
        const bufffile = fs.readFileSync(__dirname + '/../tmp/' + file.filename);
        const gpx = new gpxParser(); gpx.parse(bufffile);
        if (gpx.tracks[0] === undefined) throw { status: 422, message: "The gpx file provided is not a valid one" }
        const coors = [];
        gpx.tracks[0].points.forEach(p => coors.push([p["lat"], p["lon"]]));
        const lats = coors.map(p => p[0]); const lons = coors.map(p => p[1]);
        const centerlat = (Math.max(...lats) + Math.min(...lats)) / 2;
        const centerlon = (Math.max(...lons) + Math.min(...lons)) / 2;
        const len = gpx.tracks[0].distance["total"];
        const ascent = gpx.tracks[0].elevation["max"] - gpx.tracks[0].elevation["min"];
        const geopos = await points.getGeoAreaPoint(coors[0][0], coors[0][1], true);
        let startPoint, endPoint;
        if (coors[0][0] === coors[coors.length - 1][0] && coors[0][1] === coors[coors.length - 1][1]) {
            startPoint = await pointsdao.insertPoint("Point of hike " + body.name, coors[0][0], coors[0][1], gpx.tracks[0].points[0]["ele"], geopos, "hikePoint", "Default starting and arrival point of hike " + body.name);
            endPoint = startPoint;
        }
        else {
            startPoint = await pointsdao.insertPoint("Point of hike " + body.name, coors[0][0], coors[0][1], gpx.tracks[0].points[0]["ele"], geopos, "hikePoint", "Default starting point of hike " + body.name);
            const geoposend = await points.getGeoAreaPoint(coors[coors.length - 1][0], coors[coors.length - 1][1], true);
            endPoint = await pointsdao.insertPoint("Point of hike " + body.name, coors[coors.length - 1][0], coors[coors.length - 1][1], gpx.tracks[0].points[coors.length - 1]["ele"], geoposend, "hikePoint", "Default arrival point of hike " + body.name);
        }
        const hikeid = await hikesdao.newHike(body.name, user.username, len / 1000, (len / 1000) / 2, ascent, body.description, body.difficulty.toUpperCase(), startPoint, endPoint, coors, centerlat, centerlon, Math.max(...lats), Math.max(...lons), Math.min(...lats), Math.min(...lons));
        for (const i of images) {
            await hikesdao.insertImageForHike(hikeid, i);
        }
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}

const hikesInBounds = async (maxLat, maxLng, minLat, minLng) => {
    try {
        if (!isFinite(maxLat) || !isFinite(maxLng) || !isFinite(minLat) || !isFinite(minLng)) throw { status: 422, message: "Bad parameters" };
        const ret = await hikesdao.hikesInBounds(parseFloat(maxLat), parseFloat(maxLng), parseFloat(minLat), parseFloat(minLng));
        return ret;
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}

const addReferencePoint = async (user, hikeId, body, files) => {
    try {
        //console.log("In add ref point with hikeid",hikeId,"FILES",files,"body",body,"user",user);
        if (user.type !== "localGuide") throw { status: 401, message: "This type of user can't link points to a hike" };
        else if (!isFinite(hikeId) || !isFinite(body.latitude) || !isFinite(body.longitude) || typeof (body.name) !== "string" || typeof (body.description) !== "string") throw { status: 422, message: "Bad parameters" };
        const hike = await hikesdao.getHike(parseInt(hikeId));
        if (user.username !== hike.author) throw { status: 401, message: "This local guide doesn't have the rigths to update this hike reference points" };
        const hikeMap = await hikesdao.getHikeMap(parseInt(hikeId));
        //console.log("POINT IS PART OF HIKE? ",hikeMap.coordinates.some(p=>p[0]===parseFloat(body.latitude) && p[1]===parseFloat(body.longitude)))
        if (!hikeMap.coordinates.some(p => p[0] === parseFloat(body.latitude) && p[1] === parseFloat(body.longitude))) throw { status: 422, message: "These coordinates are not part of the hike track" };
        const geoData = await points.getGeoAndLatitude(body.latitude, body.longitude);
        const pointId = await pointsdao.insertPoint(body.name, parseFloat(body.latitude), parseFloat(body.longitude), geoData.altitude, geoData.geopos, "referencePoint", body.description);
        await pointsdao.linkPointToHike(parseInt(hikeId), pointId);
        for (const i of files) {
            await pointsdao.insertImageForPoint(pointId, i);
        }
    } catch (error) {
        //console.log("Error in add ref points",error);
        throw { status: error.status, message: error.message };
    }
}

const getMap = async id => {
    try {
        if (!isFinite(id)) throw { status: 422, message: "Id should be an integer" };
        const ret = await hikesdao.getHikeMap(parseInt(id));
        return ret;
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}

const getImages = async hikeId => {
    try {
        if (!isFinite(hikeId)) throw { status: 422, message: "Bad parameters" };
        const ret = await hikesdao.getImages(parseInt(hikeId));
        return ret;
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}

const finishHike = async (time, timeOnClock) => {
    console.log(time);
}

const hikes = { newHike, hikesInBounds, addReferencePoint, getMap, getHikes, getHikesFilters, getImages, finishHike };
module.exports = hikes;