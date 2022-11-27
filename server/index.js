'use strict';
const express = require('express');
const hikesdao = require('./dao/hikes');
const hikes = require('./services/hikes');
const parkings = require('./dao/parkings');
const multer = require('multer');
const huts = require('./dao/huts');
const app = express();
const port = 3001;
const upload = multer();

// AUTHENTICATION CONTROL
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cors = require('cors');
const user = require("./user");
const userdao = require('./dao/user-dao');
const tokens = require("./tokens");
const ref = require("./referencePoints");
const points = require('./dao/points');

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
    hikesdao.getHikesList()
        .then(hikes => { res.json(hikes) })
        .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
});

const KMPERLAT = 110574;
const KMPERLON = lat => {
    //console.log("returning kmperlon",111320*Math.cos(lat* (Math.PI / 180)));
    //console.log("in radiants",lat* (Math.PI / 180))
    return 111320 * Math.cos(lat * (Math.PI / 180));
}

// every field can contain a value or be null -> everything null == getHikesList()
app.post('/api/hikes', async (req, res) => {
    //console.log("In hikes with",req.body);
    let centerlat, centerlon, latdegr, londegr;
    if (req.body.area === undefined) {
        centerlat = 0;
        centerlon = 0;
        latdegr = 90;
        londegr = 180;
    }
    else {
        centerlat = req.body.area.center.lat;
        centerlon = req.body.area.center.lng;
        latdegr = req.body.area.radius / KMPERLAT;
        londegr = req.body.area.radius / KMPERLON(centerlon);
        //console.log("Latdeggr",latdegr,"Londegr",londegr);
    }
    hikesdao.getHikesListWithFilters(req.body.lengthMin, req.body.lengthMax, req.body.expectedTimeMin, req.body.expectedTimeMax, req.body.ascentMin, req.body.ascentMax, req.body.difficulty, centerlat, centerlon, latdegr, londegr)
        .then(hikes => { res.json(hikes) })
        .catch(error => res.status(error.status).json(error.message).end());
});

app.get('/api/hikes/:id/map', isLoggedIn, async (req, res) => {
    try {
        //console.log("IN GET MAP FOR ",req.params.id);
        const ret = await hikesdao.getHikeMap(parseInt(req.params.id));
        //console.log("\n\n\n\tReturning\n",ret);
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})

app.post('/api/newHike', isLoggedIn, upload.single('file'), async (req, res) => {
    try {
        //console.log("In new HIKE");
        await hikes.newHike(req.body["name"], req.user, req.body["description"], req.body["difficulty"], req.file.buffer.toString());
        //console.log("Finished new hike");
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
    const { name, country, numberOfGuests, numberOfBedrooms, coordinate } = req.body;
    huts.insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate)
        .then(lastId => res.json(lastId))
        .catch(err => res.status(500).json('Error on inserting hut: \r\n' + err));
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
    const { name, country, numberOfGuests, numberOfBedrooms, coordinate, geographicalArea } = req.body;
    huts.getHutsListWithFilters(name, country, numberOfGuests, numberOfBedrooms, coordinate, geographicalArea)
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
        await parkings.addParking(req.body);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of the parking lot` });
    }
});

app.get('/api/logged', isLoggedIn, async (req, res) => {

    res.json({ username: req.user.username, type: req.user.type });
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
        res.status(error.code).json(error.message);
    }
});

app.post('/api/updateStartEndPoint', isLoggedIn,async (req, res) => {
    console.log("Updatestart end point with ",req.body);
    const { IDHike, StartPoint, EndPoint } = req.body;
    console.log("IDHIKE",IDHike,"StartPoint",StartPoint,"EndPoint",EndPoint);
    try {
        await hikesdao.updateStartingArrivalPoint(IDHike, StartPoint, EndPoint);
        res.status(201).end();
    } catch (error) {
        res.status(error.code).json(error.message);
    }
});


app.post('/api/pointsInBounds',isLoggedIn, async(req,res)=>{
    try {
        console.log("In get points in bounds with ",req.body);
        const ret=await points.getPointsInBounds(req.body.bounds[1][0],req.body.bounds[0][0],
            req.body.bounds[1][1],req.body.bounds[0][1],
            req.body.startPointCoordinates[0],req.body.startPointCoordinates[1],
            req.body.endPointCoordinates[0],req.body.endPointCoordinates[1]);
        console.log("Returning",ret);
        res.status(201).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message)
    }
})

app.post('/api/hutsInBounds',isLoggedIn, async(req,res)=>{
    try {
        console.log("In get points in bounds with ",req.body);
        const ret=await points.hutsInBounds(req.body.bounds[1][0],req.body.bounds[0][0],
            req.body.bounds[1][1],req.body.bounds[0][1],
            req.body.startPointCoordinates[0],req.body.startPointCoordinates[1],
            req.body.endPointCoordinates[0],req.body.endPointCoordinates[1]);
        console.log("Returning",ret);
        res.status(201).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message)
    }
})

app.listen(port, () =>
    console.log(`Server started at http://localhost:${port}.`)
);

module.exports = app;