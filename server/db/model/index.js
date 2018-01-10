// index.js
const mysql = require('mysql2')
    , SQL_LIST = require('../sql/sql-tree')

// create the connection to database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', 
    database: 'Sally'
});


let Model = {}; 

Model.debug = true; 

Model.query = function(){
    let args = Array.from(arguments); 

    return new Promise((res, rej) => {
        Model.debug &&
            console.log('[ Model.query ] {');
            console.log('    ', args);
            console.log('}\n'); 

        conn.query.apply(conn, args.concat(function(err, results){
            if (err) rej(err);
            else res(results); 
        })); 
    })
}

Model.$ = function(path){
    let args = Array.from(arguments); 
    let ofRes = this.of.apply(this, args); 
    let {sql, pendding} = ofRes; 

    Model.debug && 
        console.log('[ Model.$ ] {'),
        console.log('     SQL:', sql),
        console.log('     PED:', pendding),
        console.log('}\n'); 

    return this.query(sql, pendding); 
}

Model.of = function(path){
    let paths = path.split('/').filter(e => e); 
    let xs = Array.from(arguments).slice(1); 
    let pendding = []; 

    try {
        let sql = paths.reduce((SQL_NODE, nextPath) => {
            let nextNode = SQL_NODE[nextPath]; 

            if (typeof nextNode === 'function'){
                let toApply = xs.slice(0, nextNode.length); 
                pendding = xs.slice(nextNode.length); 

                return nextNode.apply(nextNode, toApply); 
            } else {
                return nextNode; 
            }
        }, SQL_LIST);

        return {
            sql, pendding
        }
    } catch (err){
        return null; 
    }
}

let s = Model.$('/users/searchBy', 'uname', 'eczn').then(res => {
    console.log(res); 
}); 


module.exports = Model; 
