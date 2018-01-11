// sql.list.js
module.exports = {
    users: {
        findAll: 'SELECT * FROM Users', 
        findOne: key => `SELECT * FROM \`Users\` WHERE \`${key}\` = ?`, 
        new: (uid, uname, pwd) => `
            INSERT INTO \`Users\` (uid, uname, pwd) VALUES ('${uid}', '${uname}', '${pwd}');
        `
    },
    blogs: {
        pagination: 
            (p, N) => `SELECT * FROM \`Blogs\` ORDER BY created_at DESC LIMIT ${p * N}, ${N}`,
        new: `
            INSERT INTO \`Blogs\` (uid, bid, caid, title, content) VALUES (?, ?, ?, ?, ?);
        `
    },
    cates: {
        new: `
            INSERT INTO \`Cates\` (uid, caid, cname, intro) VALUES (?, ?, ?, ?);
        `, 
        withUser: `
            SELECT cname, intro, Cates.created_at FROM Cates, Users 
            WHERE Cates.uid = Users.uid 
        `, 
        listAll: `
            SELECT * FROM Cates;
        `
    }
}


