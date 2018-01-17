// index.js 
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')
    // , rps = require('../rps')
    , auth = require('../../utils/auth')

module.exports = router; 

router.get('/', function(req, res){
    let { $rps } = res; 

    let { todo } = req.query; 
    todo = todo || 'listAll'; 
    todo = todo.trim(); 

    Model.$(`/cates/${todo}`).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
}); 

router.get('/count-4-blog', function(req, res){
    let { $rps } = res; 

    Model.$('/cates/countForBlog').then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
})

router.post('/', function(req, res){
    let { $rps } = res; 

    let { cname, intro } = req.body; 
    let caid = Model.uuid(); 
    let uid = req.user.uid; 

    if (!cname || !cname.trim() || !intro || !intro.trim()) {
        $rps(4000, req.body); 
    }

    // uid, caid, cname, intro
    // console.log(uid, caid, cname, intro);
    Model.$('/cates/new', uid, caid, cname, intro).then(sqlRes => {
        $rps(2000, {
            uid, caid, cname, intro
        }); 
    }).catch(err => {
        $rps(5001, err); 
    })
}); 
