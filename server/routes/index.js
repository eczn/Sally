const express = require('express')
	, router = express.Router()
	, user = require('./user')
	, all = require('./all')
	, blog = require('./blog')
	, cate = require('./cate')
	, rps = require('./rps')

router.use('*', function(req, res, next){
	let $rps = rps.of(res); 
	res.$rps = $rps; 

	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	
	next(); 
}); 

router.get('/', function(req, res, next) {
	let { $rps } = res; 
	$rps(2000, 'Hello, Sally'); 
});

router.use('/user', user);

// For Login; 
router.use('/', all); 


// blog 
router.use('/blog', blog); 

router.use('/cate', cate);

module.exports = router;
