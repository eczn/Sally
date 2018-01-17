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

router.get('/by-user', function(req, res){
    let { $rps } = res; 
    let { uid } = req.query;

    Model.$('/blogs/findByUser', uid).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => {
        console.log(err); 
        $rps(5001, err); 
    }); 
});

router.get('/by-cate', function(req, res){
    let { $rps } = res; 
    let { caid } = req.query; 

    Model.$('/blogs/findByCate', caid).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => {
        console.log(err); 
        $rps(5001, err); 
    }); 
})

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

router.get('/search', function(req, res){
    let { q } = req.query; 
    let { $rps } = res; 

    if (!q || !q.trim()) return $rps(4001, req.query); 

    Model.$('/blogs/searchAll', q).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => $rps(5001, err)); 
});

router.post('/', function(req, res){
    let { $rps } = res; 
    // title, content, caid 
    let { title, content, caid, md_src } = req.body; 
    let bid = Model.uuid(); 
    let uid = req.user.uid; 

    // 不满足 
    if (
        !title        || !content        || !caid        || !md_src        || 
        !title.trim() || !content.trim() || !caid.trim() || !md_src.trim()
    ) {
        return $rps(4000, req.body); 
    }

    // uid, bid, caid, title, content
    Model.$('/blogs/new', uid, bid, caid, title, md_src, content).then(sqlRes => {
        $rps(2000, {
            uid, bid, caid, title, content
        }); 
    }).catch(err => {
        $rps(5001, err); 
    }); 
});

router.get('/count', function(req, res){
    let { $rps } = res; 

    Model.$('/blogs/count').then(res => {
        $rps(2000, res[0] && res[0].COUNT); 
    }).catch(err => {
        $rps(5001, err); 
    })
})

router.post('/del', function(req, res){
    let { $rps } = res; 
    let { bid } = req.body; 
    let { uid } = req.user; 

    Model.$('/blogs/remove', uid, bid).then(res => {
        $rps(2000, res); 
    }).catch(err => {
        $rps(5001, err); 
    })
});

router.post('/fresh', function(req, res){
    let { $rps } = res; 
    let updator = {}; 
    let { uid } = req.user; 
    let { title, content, bid, md_src } = req.body;

    if (
        !title        || !content        || !bid        || !md_src        || 
        !title.trim() || !content.trim() || !bid.trim() || !md_src.trim()
    ) {
        return $rps(4000, req.body); 
    }

    Model.$('/blogs/update', title, content, md_src, uid, bid).then(res => {
        $rps(2000, res); 
    }).catch(err => {
        $rps(5001, err); 
    })
}); 

module.exports = router;

