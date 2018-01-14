// index.js 
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')

module.exports = router; 

router.get('/count-all', function(req, res){
    let { $rps } = res; 

    let l = Model.of('/sys/countAll');
    
    let sqlings = l.sql.map(e => Model.query(e)); 
    
    Promise.all(sqlings).then(sqlRes => {
        let o = {}; 
    
        sqlRes.forEach(arr => {
            let e = arr.pop(); 
            let onlyKey = Object.keys(e)[0]; 
    
            o[onlyKey] = e[onlyKey]
        });
    
        $rps(2000, o); 
    }).catch(err => {
        $rps(5001, err); 
    });
}); 

