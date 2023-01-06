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
        let sql = 'INSERT INTO PREFERENCES(IDUser,MIN_LENGTH,MAX_LENGTH,MIN_ASCENT,MAX_ASCENT,MIN_TIME,MAX_TIME) VALUES(?,?,?,?,?,?,?)';

        if (!oldPreferences) {
            userDao.getUserType(obj.IDUser).then((type) => {
                if (!type) {
                    reject({ status: 404, message: 'user not found' });
                    return;
                }
                db.run(sql, [obj.IDUser, obj.minLength, obj.maxLength, obj.minAscent, obj.maxAscent, obj.minTime, obj.maxTime], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });

            }).catch(reject);


        } else {
            userDao.getUserType(obj.IDUser).then((type) => {
                sql = 'UPDATE PREFERENCES SET MIN_LENGTH = ?,MAX_LENGTH = ?,MIN_ASCENT = ?,MAX_ASCENT = ?,MIN_TIME = ?,MAX_TIME = ? WHERE IDUser = ?';

                if (!type) {
                    reject({ status: 404, message: 'user not found' });
                    return;
                }
                db.run(sql, [obj.minLength, obj.maxLength, obj.minAscent, obj.maxAscent, obj.minTime, obj.maxTime, obj.IDUser], function (err) {
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