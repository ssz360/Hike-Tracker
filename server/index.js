'use strict';
const express = require('express');
const hikesdao = require('./dao/hikes');
const hikes= require('./services/hikes');
const multer=require('multer');
const huts = require('./dao/huts');
const app = express();
const port = 3001;
const upload=multer();

// AUTHENTICATION CONTROL
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cors = require('cors');
const user = require("./user");
const userdao= require('./dao/user-dao');
const tokens = require("./tokens");

app.use(express.json());
passport.use(new LocalStrategy((username, password, callback)=>{
    userdao.login(username, password).then((user) => { 
        if (!user)  return callback(null, false, { message: 'Incorrect username and/or password.' });
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

app.get('/api/hikes', async (req, res) => {
    hikesdao.getHikesList()
        .then(hikes => { res.json(hikes) })
        .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
});


// every field can contain a value or be null -> everything null == getHikesList()
app.post('/api/hikes', async (req, res) => {
    //console.log("In hikes");
    let bounds=[];
    let maxlen,minlen,maxlon,minlon;
    if (req.body.area===undefined){
        maxlen=undefined;
        minlen=undefined;
        maxlon=undefined;
        minlon=undefined;
    }
    else{
        const boundsa=req.body.area;
        bounds.push([boundsa._southWest.lat,boundsa._southWest.lng]);
        bounds.push([boundsa._northEast.lat,boundsa._northEast.lng]);
        //console.log(bounds);
        maxlen=Math.max(bounds[0][0],bounds[1][0]);
        minlen=Math.min(bounds[0][0],bounds[1][0]);
        maxlon=Math.max(bounds[0][1],bounds[1][1]);
        minlon=Math.min(bounds[0][1],bounds[1][1]);
    }
    hikesdao.getHikesListWithFilters(false,req.body.lengthMin, req.body.lengthMax, req.body.expectedTimeMin, req.body.expectedTimeMax, req.body.ascentMin, req.body.ascentMax, req.body.difficulty,maxlen,minlen,maxlon,minlon)
        .then(hikes => res.json(hikes) )
        .catch(error => res.status(error.status).json(error.message).end());
});

app.post('/api/user/hikes',isLoggedIn,async (req,res)=>{
    try {
        //console.log("In user/hikes");
        let bounds=[];
        let maxlen,minlen,maxlon,minlon;
        if (req.body.area===undefined){
            maxlen=undefined;
            minlen=undefined;
            maxlon=undefined;
            minlon=undefined;
        }
        else{
            const boundsa=req.body.area;
            bounds.push([boundsa._southWest.lat,boundsa._southWest.lng]);
            bounds.push([boundsa._northEast.lat,boundsa._northEast.lng]);
            //console.log(bounds);
            maxlen=Math.max(bounds[0][0],bounds[1][0]);
            minlen=Math.min(bounds[0][0],bounds[1][0]);
            maxlon=Math.max(bounds[0][1],bounds[1][1]);
            minlon=Math.min(bounds[0][1],bounds[1][1]);
        }
        const ret=await hikesdao.getHikesListWithFilters(true,req.body.lengthMin, req.body.lengthMax, req.body.expectedTimeMin, req.body.expectedTimeMax, req.body.ascentMin, req.body.ascentMax, req.body.difficulty,maxlen,minlen,maxlon,minlon);
        //console.log("\n\n\n\tReturning\n",ret);
        res.status(200).json(ret);
    } catch (error) {
        res.status(error.status).json(error.message);
    }
})

app.post('/api/newHike',isLoggedIn,upload.single('file'),async (req,res)=>{
    try {
        //console.log("In new HIKE");
        await hikes.newHike(req.body["name"],req.user,req.body["description"],req.body["difficulty"],req.file.buffer.toString());
        //console.log("Finished new hike");
        return res.status(201).end();
    } catch (error) {
        //console.log("Error in index new hike",error);
        res.status(error.status).json(error.message);
    }
})

app.post('/api/huts', async (req, res) => {

    // ***** example ****
    // {
    //     "name":"first hut",
    //     "country":"italy",
    //     "numberOfGuests":5,
    //     "numberOfBedrooms":4,
    //     "coordinates":"41.000144, 14.534893"
    //  }

    const { name, country, numberOfGuests, numberOfBedrooms, coordinate } = req.body;
    huts.insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate)
        .then(lastId => res.json(lastId))
        .catch(err => res.status(500).json('Error on inserting hut: \r\n' + err));
});
app.get('/api/parkings', async (req,res) => {
    parkings.getParkingsList()
    .then(pks => {res.json(pks)})
    .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
});

app.post('/api/parking', async (req,res) => {
  const pk = {
    "name":req.body.name,
    "desc":req.body.desc,
    "slots":req.body.slots
  };
  try {
    await parkings.addParking(pk);
    res.status(201).end();
  } catch(err) {
    res.status(503).json({error:`Database error during the creation of the parking lot`});
  }
});

app.listen(port, () =>
    console.log(`Server started at http://localhost:${port}.`)
);