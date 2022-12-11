const db = require('./dao');
const { insertPoint, getGeoArea } = require('./points');



getHutsList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS P, HUTS H WHERE P.IDPoint = H.IDPoint'
    db.all(sql, [], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const huts = row.map((h) => ({ IDPoint: h.IDPoint, Name: h.Name, Coordinates: [h.Latitude,h.Longitude], GeographicalArea: getGeoArea(h), Country: h.Country, NumberOfBedrooms: h.NumberOfBedrooms,  Phone: h.Phone, Email:h.Email, Website: h.Website   }))
        resolve(huts);
    });
});

getHutsListWithFilters = async (name, country, numberOfBedrooms, geographicalArea) => new Promise((resolve, reject) => {
    console.log("IN HUTS FILTERS WITH NAME",name,"COUNTRY",country,"NUMBEROFBEDS",numberOfBedrooms,"Geogr",geographicalArea);
    let thisName = name==null? '%' : "%" + name + "%";
    //let thisCoordinate = coordinate==null? '%' : coordinate;
    let thisCountry = country==null? '%' : country;
    let thisNumberOfBedrooms = numberOfBedrooms==null? 0 : numberOfBedrooms;
    let thisProvince = geographicalArea==null? '%' : geographicalArea;
    let thisRegion= geographicalArea==null? '%' : geographicalArea;
    
    //console.log(thisName + " " + thisCoordinate + " " + thisCountry + " " + thisNumberOfGuests + " " + thisNumberOfBedrooms + " ")
    
    const sql = 'SELECT * FROM POINTS P, HUTS H WHERE P.IDPoint = H.IDPoint AND UPPER(P.Name) LIKE UPPER(?) AND UPPER(Country) LIKE UPPER(?) AND UPPER(TypeOfPoint) = UPPER(?) AND NumberOfBedrooms>=? AND UPPER(Province) LIKE UPPER(?) AND UPPER(Region) LIKE UPPER(?)'

    db.all(sql, [thisName, thisCountry, "hut", thisNumberOfBedrooms, thisProvince, thisRegion], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const huts = row.map((h) => ({ IDPoint: h.IDPoint, Name: h.Name, Coordinates: [h.Latitude,h.Longitude], GeographicalArea: getGeoArea(h) , Country: h.Country, NumberOfBedrooms: h.NumberOfBedrooms, Phone: h.Phone, Email:h.Email, Website: h.Website  }))
        console.log("Returning huts",huts);
        resolve(huts);
    });
});

function insertHut(name, description, numberOfBedrooms, coordinate, geopos, altitude, phone, email, website) {
    return new Promise((res, rej) => {

        // if (!name || !description || !phone || !email) {
        //     rej("All of the 'name, country, numberOfBedrooms, referencePointId, phone, email' are required");
        //     return;
        // }
        if (!name ) {
            rej("Name missing");
            return;
        }
        if (!description ) {
            rej("Description missing");
            return;
        }
        if (!numberOfBedrooms ) {
            rej("numberOfBedrooms missing");
            return;
        }
        if (!phone ) {
            rej("Phone missing");
            return;
        }
        if (!email ) {
            rej("Email missing");
            return;
        }

        insertPoint(name, coordinate[0],coordinate[1], altitude, geopos, "hut", description).then(pointId => {

            let query = `INSERT INTO HUTS (NumberOfBedrooms,IDPoint, Phone, Email, Website) VALUES(?,?,?,?,?);`;
            
            db.run(query, [numberOfBedrooms, pointId, phone, email, website], function (err) {
                if (err) {
                    rej({status:503,message:err});
                    return;
                }
                res(this.lastID);
            });
        }).catch(err => rej({status:500,message:'Error on inserting hut: \r\n' + err}));
    });
}

module.exports = { getHutsList, insertHut, getHutsListWithFilters };