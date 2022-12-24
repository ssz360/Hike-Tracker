'use strict';
const express = require('express');
const hikesdao = require('./dao/hikes');
const hikes = require('./services/hikes');
const parkings = require('./dao/parkings');
const multer = require('multer');
const huts = require('./dao/huts');
const uuid = require('uuid');
const path = require('path');
const app = express();
const port = 3001;
const upload = multer();
const storageEngine = multer.diskStorage({
    destination: "./public/images",
    limits: { fileSize: 8000000 },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    },
});
const uploadImages = multer({
    storage: storageEngine,
    limits: { fileSize: 8000000 }
});
// AUTHENTICATION CONTROL
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cors = require('cors');
const user = require("./user");
const userdao = require('./dao/user-dao');
const tokens = require("./tokens");
const ref = require("./referencePoints");
const pointsdao = require('./dao/points');
const points = require('./services/points');
const preferences = require('./dao/preferences');

app.use(express.json());
passport.use(new LocalStrategy((username, password, callback) => {
    userdao.login(username, password).then((user) => {
        if (!user) return callback(null, false, { message: 'Incorrect username and/or password.' });
        return callback(null, user);
    });
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
    // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};
app.use(cors(corsOptions));
app.use(session({
    secret: "the sky is red!",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

app.delete('/api/logout', isLoggedIn, async (req, res) => {
    req.logOut(() => {
        return res.status(204).end();
    });
})

app.post('/api/login', passport.authenticate('local'), (req, res) => {

    // This function is called if authentication is successful.
    // req.user contains the authenticated user.
    res.json({ username: req.user.username, type: req.user.type });
});

app.post("/api/register", user.register);
app.post("/api/resendVerification", isLoggedIn, tokens.resendVerification);
app.get("/api/verify/:token", tokens.verify);
app.post("/api/referencePoint", ref.addReferencePoint);

app.get('/api/hikes', async (req, res) => {
    try {
        const ret = await hikes.getHikes();
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message);
    }
});

// every field can contain a value or be null -> everything null == getHikesList()
app.post('/api/hikes', async (req, res) => {
    console.log("In hikes with", req.body);
    let centerlat, centerlon, radius;
    if (req.body.area === undefined) {
        centerlat = 0;
        centerlon = 0;
        radius = 6371;
    }
    else {
        centerlat = req.body.area.center.lat;
        centerlon = req.body.area.center.lng;
        radius = req.body.area.radius;
    }
    hikesdao.getHikesListWithFilters(req.body.lengthMin, req.body.lengthMax, req.body.expectedTimeMin, req.body.expectedTimeMax, req.body.ascentMin, req.body.ascentMax, req.body.difficulty, centerlat, centerlon, radius)
        .then(hikes => { res.json(hikes) })
        .catch(error => res.status(error.status).json(error.message).end());
});

app.get('/api/hikes/filters', async (req, res) => {
    try {
        console.log("Query", req.query);
        const ret = await hikes.getHikesFilters(req.query);
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message);
    }
});

app.get('/api/hikes/:id/map', isLoggedIn, async (req, res) => {
    try {
        const ret = await hikes.getMap(req.params.id);
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})

app.post('/api/newHike', isLoggedIn, upload.single('file'), async (req, res) => {
    try {
        await hikes.newHike(req.user, req.body, req.file);
        return res.status(201).end();
    } catch (error) {
        //console.log("Error in index new hike",error);
        res.status(error.status).json(error.message);
    }
})

// DESCRIPTION ===========================================================================================================
// Returns the list of huts according to a series of filters: name, country, numberOfGuests, numberOfBedrooms, coordinates
// It can be used for searchbar too: name should be the only field passed on req.body
// Searchbar is case insensitive

// ***** example ****
// {
//     "name":"first hut",
//     "country":"italy",
//     "numberOfGuests":5,
//     "numberOfBedrooms":4,
//     "coordinates":"41.000144, 14.534893"
//  }

app.post('/api/huts', async (req, res) => {
    try {
        const { name, description, numberOfBedrooms, coordinate, phone, email, website } = req.body;
        const geodata = await points.getGeoAndLatitude(coordinate[0], coordinate[1]);
        const ret = await huts.insertHut(name, description, numberOfBedrooms, coordinate, geodata.geopos, geodata.altitude, phone, email, website);
        return res.status(201).json(ret);
    } catch (error) {
        console.log(error);
        res.status(error.status).json(error.message);
    }
});

// DESCRIPTION ===========================================================================================================
// Returns the list of huts according to a series of filters: name, country, numberOfGuests, numberOfBedrooms, coordinates
// It can be used for searchbar too: name should be the only field passed on req.body
// Searchbar is case insensitive

// ***** example - request ****
// {
//     "name":"first hut",
//     "country":"italy",
//     "numberOfGuests": null, //all fields can be null -> if everything is null the list has no filters
//     "numberOfBedrooms":4,
//     "coordinates":"41.000144, 14.534893"
//     "geographicalArea" : null
//  }

// ***** example - response ****
// [
//  {
//     "IDPoint":"First hut",
//     "Name":"Hut name",
//     "Coordinates":"41.000144, 14.534893"
//     "GeographicalArea" : "Piedmont"
//     "Country" : "Italy"
//     "NumberOfGuests" : 5
//     "numberOfBedrooms": 4,
//  }
// ]
app.post('/api/huts/list', async (req, res) => {
    const { name, country, numberOfBedrooms, geographicalArea } = req.body;
    console.log("IN server FILTERS WITH NAME", name, "COUNTRY", country, "NUMBEROFBEDS", numberOfBedrooms, "Geogr", geographicalArea);
    huts.getHutsListWithFilters(name, country, numberOfBedrooms, geographicalArea)
        .then(huts => res.json(huts))
        .catch(err => res.status(500).json('Error looking for hut: \r\n' + err));
});

// DESCRIPTION ===========================================================================================================
// Returns the list of parkings

app.get('/api/parkings', async (req, res) => {
    parkings.getParkingsList()
        .then(pks => { res.json(pks) })
        .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
});

// DESCRIPTION ===========================================================================================================
// Insert in the db a parking
// The following fields in req.body are required: name, description, #slots

// ***** example ****
// {
//     "name":"parking name",
//     "desc":"this is a parking",
//     "slots": 43
//  }

app.post('/api/parking', async (req, res) => {
    //   const pk = {
    //     "name":req.body.name,
    //     "desc":req.body.desc,
    //     "slots":req.body.slots
    //   };
    try {
        //     await parkings.addParking(pk);
        console.log("IN POST PARKING WITH ", req.body);
        await parkings.addParking(req.body);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of the parking lot` });
    }
});

app.get('/api/logged', isLoggedIn, async (req, res) => {

    res.json({ username: req.user.username, type: req.user.type, name: req.user.name, surname: req.user.surname, phonenumber: req.user.phonenumber });
})
// DESCRIPTION ===========================================================================================================
// Link point to hikes
// task : B - Update the db structure to link points to hikes

// ***** example ****
// {
//     "IDHike":1,
//     "IDPoint":1
// } 

app.post('/api/addReferenceToHike', async (req, res) => {
    const { IDHike, IDPoint } = req.body;

    try {
        await hikesdao.addReferenceToHike(IDHike, IDPoint);
        res.status(201).end();
    } catch (error) {
        res.status(error.status).json(error.message);
    }
});

app.post('/api/:hikeId/startPoint', isLoggedIn, async (req, res) => {
    try {
        await points.linkStart(req.user, req.params.hikeId, req.body);
        res.status(201).end();
    } catch (error) {
        res.status(error.status).json(error.message);
    }
});

app.post('/api/:hikeId/endPoint', isLoggedIn, async (req, res) => {
    try {
        await points.linkEnd(req.user, req.params.hikeId, req.body);
        res.status(201).end();
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})


/*app.post('/api/pointsInBounds', isLoggedIn, async (req, res) => {
    try {
        //console.log("In get points in bounds with ",req.body);
        const ret=await pointsdao.getPointsInBounds(req.body.bounds[1][0],req.body.bounds[0][0],
            req.body.bounds[1][1],req.body.bounds[0][1],
            req.body.startPointCoordinates[0],req.body.startPointCoordinates[1],
            req.body.endPointCoordinates[0],req.body.endPointCoordinates[1]);
        //console.log("Returning",ret);
        res.status(201).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message)
    }
})*/

app.get('/api/hikes/:hikeId/linkablehuts', isLoggedIn, async (req, res) => {
    try {
        const ret = await points.linkableHuts(req.user, req.params.hikeId);
        res.status(201).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message)
    }
})

app.post('/api/hikes/:hikeId/linkHut', isLoggedIn, async (req, res) => {
    try {
        await points.linkHut(req.user, req.params.hikeId, req.body);
        return res.status(201).end();
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})

app.delete('/api/hikes/:hikeId/linkHut', async (req, res) => {
    try {
        await points.unlinkHut(req.user, req.params.hikeId, req.body);
        return res.status(204).end();
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})

app.get('/api/hikes/:hikeId/linkableStartPoints', isLoggedIn, async (req, res) => {
    try {
        const ret = await points.linkableStartPoints(req.user, req.params.hikeId);
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message)
    }
})

app.get('/api/hikes/:hikeId/linkableEndPoints', isLoggedIn, async (req, res) => {
    try {
        const ret = await points.linkableEndPoints(req.user, req.params.hikeId);
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message)
    }
})


app.get('/api/hikes/bounds/:maxLat/:maxLng/:minLat/:minLng', isLoggedIn, async (req, res) => {
    try {
        const ret = await hikes.hikesInBounds(req.params.maxLat, req.params.maxLng, req.params.minLat, req.params.minLng);
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message)
    }
})

app.post('/api/hikes/:hikeId/referencePoint', isLoggedIn, uploadImages.array('images'), async (req, res) => {
    try {
        await hikes.addReferencePoint(req.user, req.params.hikeId, req.body, req.files);
        return res.status(201).json();
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})

app.get('/api/point/:pointId/images', async (req, res) => {
    try {
        const ret = await points.getImages(req.params.pointId);
        return res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})

// return value:

// {"userId":"davidwallace@gmail.com","minLength":2,"maxLength":5,"minAscent":200,"maxAscent":500,"minTime":1,"maxTime":4}

app.get('/api/preferences', isLoggedIn, async (req, res) => {
    try {
        const ret = await preferences.getUserPreferences(req.user.username);
        if (!ret) {
            res.status(404).end();
            return;
        }
        res.status(200).json({ userId: ret.IDUser, minLength: ret.MIN_LENGTH, maxLength: ret.MAX_LENGTH, minAscent: ret.MIN_ASCENT, maxAscent: ret.MAX_ASCENT, minTime: ret.MIN_TIME, maxTime: ret.MAX_TIME });
    } catch (error) {
        res.status(error.status ?? 500).json(error.message)
    }
})

// expected data:

// The body:

// {
//     "minLength": 2,
//     "maxLength": 5,
//     "minAscent": 200,
//     "maxAscent": 500,
//     "minTime": 1,
//     "maxTime": 4
// }

app.post('/api/preferences', isLoggedIn, async (req, res) => {
    try {
        const obj = req.body;
        const ret = await preferences.addUpdateReference({
            IDUser: req.user.username,
            minLength: obj.minLength,
            maxLength: obj.maxLength,
            minAscent: obj.minAscent,
            maxAscent: obj.maxAscent,
            minTime: obj.minTime,
            maxTime: obj.maxTime
        });
        res.status(201).json(ret);
    } catch (error) {
        res.status(error.status ?? 500).json(error.message)
    }
})

app.use(express.static('public'));
// req.body: { user: { username: string }}
// res.body: { hikeList: Array<Hike> }

// app.get("/api/hikes/byUserPreference", isLoggedIn, async (req, res) => {
// 	try {
// 		const userPref = await preferences.getUserPreferences(parseInt(req.user.username)).catch(err => {
// 			throw err;
// 		});
// 		// console.log("userPref", userPref);
// 		await hikesdao
// 			.getHikesListWithFilters(undefined, userPref.length, undefined, userPref.time, undefined, userPref.ascent)
// 			.then(
// 				hikeList => {
// 					// console.log("hikeList.length", hikeList.length);=> {
// 					return res.status(200).json(hikeList);
// 				},
// 				err => {
// 					throw err;
// 				}
// 			);
// 	} catch (err) {
// 		res.status(err.status).json(err.message);
// 	}
// });

app.listen(port, () =>
    console.log(`Server started at http://localhost:${port}.`)
);

module.exports = app;