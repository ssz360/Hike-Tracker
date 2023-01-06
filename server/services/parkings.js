const points = require('./points');
const parkingsdao = require('../dao/parkings');


const addParking = async (user, body) => {
    try {
        if (user.type !== "localGuide") throw { status: 401, message: "This type of user can't add a new parking lot" };
        else if (!isFinite(body.slots) || !isFinite(body.coordinates[0]) || !isFinite(body.coordinates[1]) )
            throw { status: 422, message: "Bad parameters" };
        const geodata = await points.getGeoAndLatitude(parseFloat(body.coordinates[0]), parseFloat(body.coordinates[1]));
        let pk = {
            name: body.name,
            coordinates: body.coordinates,
            description: body.desc,
            slots: body.slots
        };
        const ret = await parkingsdao.addParking(pk, geodata);
        return ret;
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}

const getParkings = async (user) => {
    try {
        if (user.type == undefined) throw { status: 401, message: "This type of user can't see the parking list" };
        const ret = await parkingsdao.getParkingsList();
        return ret;
    } catch (error) {
        throw { status: error.status, message: error.message };
    }
}
const parkings = { addParking, getParkings };

module.exports = parkings;