'use strict';
const express = require('express');
const hikes = require('./dao/hikes');
const huts = require('./dao/huts');
const app = express();
const port = 3001;

// AUTHENTICATION CONTROL
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cors = require('cors');
const user = require("./user");
const tokens = require("./tokens");

app.use(express.json());
passport.use(new LocalStrategy((username, password, callback)=>{
    user.login(username, password).then((user) => { 
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

app.listen(port, () =>
    console.log(`Server started at http://localhost:${port}.`)
);

app.get('/api/hikes', async (req, res) => {
    hikes.getHikesList()
        .then(hikes => { res.json(hikes) })
        .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
});


// every field can contain a value or be null -> everything null == getHikesList()
app.post('/api/hikes', async (req, res) => {
    hikes.getHikesListWithFilters(req.body.lengthMin, req.body.lengthMax, req.body.expectedTimeMin, req.body.expectedTimeMax, req.body.ascentMin, req.body.ascentMax, req.body.difficulty)
        .then(hikes => { res.json(hikes) })
        .catch(() => res.status(500).json({ error: `Database error fetching the services list.` }).end());
});


app.post('/api/huts', async (req, res) => {

    // ***** example ****
    // {
    //     "name":"first hut",
    //     "country":"italy",
    //     "numberOfGuests":5,
    //     "numberOfBedrooms":4,
    //     "coordinates":"41.000144, 14.534893"
    //  }

    const { name, country, numberOfGuests, numberOfBedrooms, coordinates } = req.body;
    huts.insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinates)
        .then(lastId => res.json(lastId))
        .catch(err => res.status(500).json('Error on inserting hut: \r\n' + err));
});