const express = require('express')
	, router = express.Router()
	, user = require('./user')

router.get('/', function(req, res, next) {
	res.json({
		code: 200, 
		msg: 'Hello, Sally', 
		data: null
	}); 
});

router.use('/user', user); 

module.exports = router;
