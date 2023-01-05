const fs = require("fs");
const sqlite = require("sqlite3");
const initQueries = async () => {
	const dataArr = dataSql.toString().split(");");
	db.serialize(() => {
		db.run("PRAGMA foreign_keys=ON;");
		db.run("BEGIN TRANSACTION;");
		dataArr.forEach(query => {
			if (query) {
				query += ");";
				db.run(query, err => {
					if (err)
						throw err;
				});
			}
		});
		db.run("COMMIT;");
	});
};
let restart;
if (fs.existsSync(__dirname + "/hiketrackerdb.sqlite")) 
	restart = true;
else 
	restart = false;
const dataSql = fs.readFileSync(__dirname + "/initQueriesFinal.sql").toString();
const db = new sqlite.Database(__dirname + "/hiketrackerdb.sqlite", async e => {
	if (e) throw { status: 500, message: { status: 500, message: "Failed to create the database" } };
	else {
		db.loadExtension(__dirname + '/math', err => {
			if (err) {
				console.log("Err trying to load extension", err);
				throw { status: 500, message: { status: 500, message: "Failed to load an extension to the database" } };
			}
			else {
				if (!restart) initQueries().then().catch(e => { console.log("Error", e); throw { status: 503, message: { status: 503, message: "Failed to init queries" } } });
			}
		});
	}
});

module.exports = db;