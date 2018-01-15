// index.js
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')
    , rps = require('../rps')
    , auth = require('../../utils/auth')

// 注册
router.post('/', function(req, res, next) {
    let { $rps } = res; 

    let { uname, pwd } = req.body; 
    let uid = Model.uuid(); 
    
    uname = uname.trim();
    pwd = pwd.trim(); 
    
    if (!uname || !pwd) $rps(4000, req.body);

    Model.$('/users/new', uid, uname, pwd).then(sqlRes => {
        if (sqlRes.length !== 0){
            $rps(2000, {
                uname,
                uid
            }); 
        } else {
            $rps(9999, sqlRes); 
        }
    }).catch(err => {
        $rps(5001, err); 
    })
});

router.post('/update', function(req, res){
    let { key, val } = req.body; 
    let userToken = req.cookies['user']; 
    let user = auth.de(userToken); 
    let { uid } = user; 
    let { $rps } = res; 

    if (
        !key        || !val        ||
        !key.trim() || !val.trim()
    ) return $rps(4001, req.body); 

    Model.$('/users/updateOne', key, val, uid).then(r => {
        $rps(2000, r); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
})

router.get('/count', function(_, res){
    let { $rps } = res; 

    Model.$('/users/count').then(res => {
        $rps(2000, res[0] && res[0].COUNT); 
    }).catch(err => {
        $rps(5001, err); 
    })
});

router.get('/find', function(req, res){
    let { $rps } = res; 
    let { uid } = req.query; 

    Model.$('/users/findOne', 'uid', uid).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => $rps(5001, err)); 
}); 

router.get('/me', function(req, res, next){
    let { $rps } = res; 
    let userToken = req.cookies['user']; 
    let user = auth.de(userToken); 

    $rps(2000, user); 
});

router.get('/logout', function(req, res){
    let { $rps } = res; 

    res.cookie('user', ''); 

    $rps(2000, 'OK'); 
}); 

// 登陆 
router.post('/login', function(req, res){
    let { $rps } = res; 
    let { uname, pwd } = req.body; 

    Model.$('/users/findToLogin', 'uname', uname).then(sqlRes => {
        let user = sqlRes[0]; 

        if (user){
            if (user.pwd === pwd){
                delete user.pwd; 
                let token = auth.en(user);

                res.cookie('user', token); 

                $rps(2000, token); 
            } else {
                $rps(4002, null); 
            }
        } else {
            $rps(4002, null); 
        }
    })
});

module.exports = router;

