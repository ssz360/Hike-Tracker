const db = require('./dao');
const userDao = require('./users');

exports.getUserPreferences = async (userId) => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM PREFERENCES WHERE IDUser = ?'
    db.get(sql, [userId], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        const pks = row;
        resolve(pks);
    });
});

exports.addUpdateReference = (obj) => {
    return new Promise(async (resolve, reject) => {
        var oldPreferences = await this.getUserPreferences(obj.IDUser);
        let sql = 'INSERT INTO PREFERENCES(IDUser,LENGTH,ASCENT,TIME) VALUES(?,?,?,?)';

        if (!oldPreferences) {
            // check if user exists
            userDao.getUserType(obj.IDUser).then((type) => {
                if (!type) {
                    reject({ status: 404, message: 'user not found' });
                    return;
                }
                db.run(sql, [obj.IDUser, obj.length, obj.ascent, obj.time], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });

            }).catch(reject);


        } else {
            userDao.getUserType(obj.IDUser).then((type) => {
                sql = 'UPDATE PREFERENCES SET IDUser = ?,LENGTH = ?,ASCENT = ?,TIME = ? WHERE IDUser = ?';

                if (!type) {
                    reject({ status: 404, message: 'user not found' });
                    return;
                }
                db.run(sql, [obj.IDUser, obj.length, obj.ascent, obj.time, obj.IDUser], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });

            }).catch(reject);
        }

    });
};