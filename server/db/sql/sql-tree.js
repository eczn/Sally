// sql.list.js
module.exports = {
    users: {
        findAll: 'SELECT * FROM Users', 
        searchBy: key => `SELECT * FROM \`Users\` WHERE \`${key}\` = ?`, 
        new: (uname, pwd) => `
            INSERT INTO Users (uname, pwd) VALUES ('${uname}', '${pwd}');
        `
    }
}

