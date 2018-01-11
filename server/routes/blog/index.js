// index.js
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')
    , auth = require('../../utils/auth')


router.get('/', function(req, res){
    let { $rps } = res; 
    let { p, N } = req.query;
    
    // 转化为数字 
    p = p || '0'; 
    N = N || '10'; 
    p = parseInt(p.trim()) || 0; 
    N = parseInt(N.trim()) || 10; 

    Model.$('/blogs/pagination', p, N).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
});

router.get('/one', function(req, res){
    let { $rps } = res; 
    let { id, bid } = req.query; 

    // Set Alias 
    if (id) bid = id; 

    // Error
    if (!bid) return $rps(4000, req.query); 

    Model.$('/blogs/findOne', bid).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
})

router.post('/', function(req, res){
    let { $rps } = res; 
    // title, content, caid 
    let { title, content, caid } = req.body; 
    let bid = Model.uuid(); 
    let uid = req.user.uid; 

    // 不满足 
    if (
        !title        || !content        || !caid        ||
        !title.trim() || !content.trim() || !caid.trim()
    ) {
        return $rps(4000, req.body); 
    }

    // uid, bid, caid, title, content
    Model.$('/blogs/new', uid, bid, caid, title, content).then(sqlRes => {
        $rps(2000, {
            uid, bid, caid, title, content
        }); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
});

module.exports = router;

