const db = require('./dao');
const { insertPoint } = require('./points');

function insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate) {
    return new Promise((res, rej) => {

        if (!name || !country || !numberOfBedrooms || !numberOfGuests) {
            rej("All of the 'name, country, numberOfGuests, numberOfBedrooms, referencePointId' are required");
            return;
        }

        insertPoint(name + " point", coordinate, country, "hut point").then(pointId => {

            let query = `INSERT INTO HUTS (Name,Country ,NumberOfGuests,NumberOfBedrooms,IDPoint) VALUES(?,?,?,?,?);`;

            db.run(query, [name, country, numberOfGuests, numberOfBedrooms, pointId], function (err) {
                if (err) {
                    rej(err);
                    return;
                }
                res(this.lastID);
            });
        }).catch(err => rej(err));
    });
}

module.exports = { insertHut };