'use strict';
const express=require('express');
const multer=require('multer');
const fs=require('fs');
const express = require('express');
const hikes=require('./dao/hikes');
const app=express();
const upload=multer();
const gpxParser = require('gpxparser');
const hikes=require('./dao/hikes');
const port=3001;
//const fs=require('fs');
//const gpxParser = require('gpxparser');
// AUTHENTICATION CONTROL
const passport = require('passport');
const LocalStrategy = require('passport-local'); 
const session=require('express-session');
const cors = require('cors');

app.use(express.json());
//var gpx = new gpxParser(); 
passport.use(new LocalStrategy((username, password, callback)=>{
    users.login(username, password).then((user) => { 
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
    if(req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({error: 'Not authorized'});
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
app.delete('/api/logout',isLoggedIn,async(req,res)=>{
    req.logOut(()=>{
        return res.status(204).end();
    });
})

app.post('/api/login', passport.authenticate('local'), (req,res) => {
  // This function is called if authentication is successful.
  // req.user contains the authenticated user.
  res.json({username:req.user.username,type:req.user.type});
});

app.get('/api/hikes',async (req,res)=>{
    try {
        res.setHeader("Access-Control-Allow-Origin","*");
        //console.log("New request");
        const ret=await hikes.getHikesWithMapList();
        //console.log("Returning ",ret)
        res.status(200).json(ret);
    } catch (error) {
        console.log("Error",error);
        res.status(503).end();
    }
})

const getCoordinates=async path=>{
    try {
        console.log("Here in getcoordinates with path ",path);
        console.log("Current directory:", __dirname);
        const gpxToParse= await fs.readFileSync(path,'utf-8');
        gpx.parse(gpxToParse);
        return gpx.toGeoJSON().features[0].geometry.coordinates.map(e=>[e[1],e[0]]);
    } catch (error) {
        console.log("Catched error in getcoordinates ",error);
        throw {status: 503, message : error};
    }
}

app.post('/api/newHike',upload.single('file'),async (req,res)=>{
    try {
        res.setHeader("Access-Control-Allow-Origin","*");
        console.log("body",req.body);
        await hikes.newHike(req.body["name"],req.body["description"],req.body["difficulty"],req.file.buffer);
        res.status(200).end();
    } catch (error) {
        res.status(503).end();
    }
})


app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}.`)
);

app.get('/api/hikes', async (req, res) => {
    hikes.getHikesList()
      .then(hikes => {res.json(hikes)})
      .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
  });


// every field can contain a value or be null -> everything null == getHikesList()
app.post('/api/hikes', async (req, res) => {
    hikes.getHikesListWithFilters(req.body.lengthMin, req.body.lengthMax, req.body.expectedTimeMin, req.body.expectedTimeMax, req.body.ascentMin, req.body.ascentMax, req.body.difficulty)
        .then(hikes => {res.json(hikes)})
        .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
});


