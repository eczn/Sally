// index.js 
const express = require('express')
    , router = express.Router()
    , Model = require('../../db')
    , path = require('path')
    , IMG_BASE = path.join(__dirname, '../../public/api/images')
    , multer  = require('multer')
    , uuid = require('uuid/v4')
    , upload = multer({ dest: IMG_BASE })

module.exports = router; 

router.get('/', function(req, res){
    let { imid } = req.query; 
    let { $rps } = res; 

    Model.$('/images/findOne', 'imid', imid).then(sqlRes => {
        $rps(2000, sqlRes); 
    }).catch(err => $rps(5001, err)); 
}); 

router.get('/all', function(req, res){
    let { $rps } = res; 

    Model.$('/images/findAll').then(list => {
        $rps(2000, list); 
    }).catch(err => $rps(5001, err)); 
})

router.post('/', upload.single('img'), function (req, res, next) {
    // req.file 是 `img` 文件的信息
    // req.body 将具有文本域数据，如果存在的话 
    let { filename } = req.file; 
    let url = '/api/images/' + filename; 
    let { $rps } = res; 
    let imid = uuid(); 
    let { uid } = req.user

    // imid, uid, url
    Model.$('/images/new', imid, uid, url).then(sqlRes => {
        // $rps(2000, img_url); 
        $rps(2000, {
            imid, uid, url
        }); 
        
        res.end(); 
    }).catch(err => {
        $rps(5001, err); 
        
        res.end(); 
    });
}); 
