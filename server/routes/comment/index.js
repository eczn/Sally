// index.js 
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')
    , uuid = require('uuid/v4')

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

router.get('/by-user', function(req, res){
    let { uid } = req.query; 
    let { $rps } = res; 

    Model.$('/comments/linkAll', 'Comments.uid', uid)
        .then(sqlRes => $rps(2000, sqlRes))
        .catch(err =>   $rps(5001, err)); 
})

router.post('/', function(req, res){
    let { $rps } = res; 

    let { bid, text } = req.body; 
    let { uid } = req.user; 
    let coid = uuid(); 

    if (
        !bid        || !text         ||
        !bid.trim() || !text.trim()
    ) return $rps(4001, req.body); 

    // coid, bid, uid, text
    Model.$('/comments/new', coid, bid, uid, text).then(res => {
        $rps(2000, res); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
});
