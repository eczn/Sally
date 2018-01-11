// sql.list.js
module.exports = {
    users: {
        findAll: 'SELECT * FROM Users', 
        findOne: key => `SELECT * FROM \`Users\` WHERE \`${key}\` = ?`, 
        new: (uid, uname, pwd) => `
            INSERT INTO \`Users\` (uid, uname, pwd) VALUES ('${uid}', '${uname}', '${pwd}');
        `
    }
}

