// sql.list.js
module.exports = {
    users: {
        findAll: 'SELECT * FROM Users', 
        findOne: key => `
            SELECT uid, uname, avatar, role, created_at, uintro, mail, github, sf
            FROM \`Users\` WHERE \`${key}\` = ?
        `, 
        findToLogin: key => `
            SELECT * FROM Users 
            WHERE ${key} = ?
        `,
        new: (uid, uname, pwd) => `
            INSERT INTO \`Users\` (uid, uname, pwd) VALUES ('${uid}', '${uname}', '${pwd}');
        `,
        count: `SELECT COUNT(*) AS COUNT FROM Users`,
        updateOne: key => `
            UPDATE Users SET ${key} = ?
            WHERE uid = ?
        `
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
        `,
        findByUser: `
            SELECT  
                Blogs.bid,  Blogs.content, Blogs.title,  Blogs.created_at, Blogs.md_src,
                Blogs.caid, Cates.cname,   Cates.intro,
                Blogs.uid,  Users.uname,   Users.avatar
            FROM Blogs, Cates, Users
            WHERE Blogs.caid = Cates.caid AND 
                Blogs.uid = Users.uid AND 
                Users.uid = ?
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
            INSERT INTO \`Comments\` (coid, bid, uid, text) VALUES (?, ?, ?, ?); 
        `,
        findWith: key => `
            SELECT Comments.coid, Comments.uid, Comments.text, Comments.bid, Comments.created_at,
                Users.uname, Users.avatar
            FROM Comments, Users WHERE ${key} = ? 
            ORDER BY Comments.created_at DESC
        `,
        linkAll: key => `
            SELECT Comments.coid, Comments.uid, Comments.text, Comments.bid, Comments.created_at,
                Users.uname, Users.avatar, Blogs.title
            FROM Comments, Users, Blogs WHERE ${key} = ? 
            ORDER BY Comments.created_at DESC
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


