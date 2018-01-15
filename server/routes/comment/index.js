// index.js 
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')

module.exports = router; 

router.get('/', function(req, res){
    let { bid } = req.query; 
    let { $rps } = res; 

    Model.$('/comments/findWith', 'bid', bid).then(res => {
        $rps(2000, res); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
}); 

