// sql.list.js
module.exports = {
    users: {
        findAll: 'SELECT * FROM Users', 
        findOne: key => `SELECT * FROM \`Users\` WHERE \`${key}\` = ?`, 
        new: (uid, uname, pwd) => `
            INSERT INTO \`Users\` (uid, uname, pwd) VALUES ('${uid}', '${uname}', '${pwd}');
        `,
        count: `SELECT COUNT(*) AS COUNT FROM Users`
    },
    blogs: {
        count: `
            SELECT COUNT(*) AS COUNT FROM Blogs
        `,
        pagination: 
            // (p, N) => `SELECT * FROM \`Blogs\` ORDER BY created_at DESC LIMIT ${p * N}, ${N}`,
            (p, N) => `
                SELECT  
                    Blogs.bid,  Blogs.content, Blogs.title,  Blogs.created_at, Blogs.md_src,
                    Blogs.caid, Cates.cname,   Cates.intro,
                    Blogs.uid,  Users.uname,   Users.avatar
                FROM Blogs, Cates, Users
                WHERE Blogs.caid = Cates.caid AND 
                    Blogs.uid = Users.uid
                ORDER BY created_at DESC LIMIT ${p * N}, ${N}
            `,
        new: `
            INSERT INTO \`Blogs\` (uid, bid, caid, title, md_src, content) VALUES (?, ?, ?, ?, ?, ?);
        `,
        remove: `
            DELETE FROM Blogs WHERE uid = ? AND bid = ?;
        `,
        update: `
            UPDATE Blogs SET title = ?, content = ?, md_src = ?
            WHERE uid = ? AND bid = ?
        `,
        findOne: `
            SELECT  
                Blogs.bid,  Blogs.content, Blogs.title,  Blogs.created_at, Blogs.md_src,
                Blogs.caid, Cates.cname,   Cates.intro,
                Blogs.uid,  Users.uname,   Users.avatar
            FROM Blogs, Cates, Users
            WHERE Blogs.caid = Cates.caid AND 
                Blogs.uid = Users.uid AND 
                Blogs.bid = ?
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
    },
    comments: {
        new: `
            INSERT INTRO \`Comments\` (coid, bid, uid, text) VALUES (?, ?, ?, ?); 
        `
    },
    sys: {
        countAll: [
            `SELECT COUNT(*) AS Blogs    FROM Blogs`,
            `SELECT COUNT(*) AS Cates    FROM Cates`,
            `SELECT COUNT(*) AS Comments FROM Comments`,
            `SELECT COUNT(*) AS Images   FROM Images`,
            `SELECT COUNT(*) AS Users    FROM Users`
        ]
    }
}


