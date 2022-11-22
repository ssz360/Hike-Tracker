const db = require('./dao');
const { insertPoint } = require('./points');



getHutsList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS P, HUTS H WHERE P.IDPoint = H.IDPoint'
    db.all(sql, [], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const huts = row.map((h) => ({ IDPoint: h.IDPoint, Name: h.Name, Coordinates: h.Coordinates, GeographicalArea: h.GeographicalArea, Country: h.Country, NumberOfGuests: h.NumberOfGuests, NumberOfBedrooms: h.NumberOfBedrooms  }))
        resolve(huts);
    });
});

getHutsListWithFilters = async (name, country, numberOfGuests, numberOfBedrooms, coordinate, geographicalArea) => new Promise((resolve, reject) => {
    console.log(name);
    let thisName = name==null? '%' : "%" + name + "%";
    let thisCoordinate = coordinate==null? '%' : coordinate;
    let thisCountry = country==null? '%' : country;
    let thisNumberOfGuests = numberOfGuests==null? '%' : numberOfGuests;
    let thisNumberOfBedrooms = numberOfBedrooms==null? '%' : numberOfBedrooms;
    let thisGeographicalArea = geographicalArea==null? '%' : geographicalArea;
    
    //console.log(thisName + " " + thisCoordinate + " " + thisCountry + " " + thisNumberOfGuests + " " + thisNumberOfBedrooms + " ")
    
    const sql = 'SELECT * FROM POINTS P, HUTS H WHERE P.IDPoint = H.IDPoint AND UPPER(P.Name) LIKE UPPER(?) AND Coordinates LIKE ? AND UPPER(Country) LIKE UPPER(?) AND UPPER(TypeOfPoint) = UPPER(?) AND NumberOfGuests LIKE ? AND NumberOfBedrooms LIKE ? AND UPPER(GeographicalArea) LIKE UPPER(?)'

    db.all(sql, [thisName, thisCoordinate, thisCountry, "Hut", thisNumberOfGuests, thisNumberOfBedrooms, thisGeographicalArea], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const huts = row.map((h) => ({ IDPoint: h.IDPoint, Name: h.Name, Coordinates: h.Coordinates, GeographicalArea: h.GeographicalArea, Country: h.Country, NumberOfGuests: h.NumberOfGuests, NumberOfBedrooms: h.NumberOfBedrooms  }))
        resolve(huts);
    });
});

function insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate) {
    return new Promise((res, rej) => {

        if (!name || !country || !numberOfBedrooms || !numberOfGuests) {
            rej("All of the 'name, country, numberOfGuests, numberOfBedrooms, referencePointId' are required");
            return;
        }

        insertPoint(name, coordinate, country, "Hut").then(pointId => {

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

module.exports = { getHutsList, insertHut, getHutsListWithFilters };