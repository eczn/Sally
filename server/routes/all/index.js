// index.js
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')
    , rps = require('../rps')
    , auth = require('../../utils/auth')

module.exports = function(req, res, next){
    let userToken = req.cookies['user']; 
    let user = auth.de(userToken); 
    // let $rps = rps.of(res); 
    let { $rps } = res; 

    if (user){
        console.log(user); 
        req.user = user; 
        next(); 
    } else {
        $rps(4001, null); 
    }
};
