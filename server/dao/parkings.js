const db = require('./dao');

exports.getParkingsList = async () => new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM PARKINGS'              
    db.all(sql,[],(err,row) => {
        if(err) {
            reject(err);
            return;
        }
        const pks = row.map((p) => ({IDPoint:p.IDPoint, Name:p.Name, Description:p.Description, SlotsTot:p.SlotsTot, SlotsFull:p.SlotsFull}))
        resolve(pks);
    });
});

exports.addParking = (pk) => {
    return new Promise((resolve,reject) => {
        const sql = 'INSERT INTO PARKINGS(Name,Description,SlotsTot,SlotsFull) VALUES(?,?,?,?)';
        db.run(sql,[pk.name,pk.desc,pk.slots,0],function(err) {
            if(err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};