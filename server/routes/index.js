const express = require('express')
    , router = express.Router()

router.get('/', function(req, res, next) {
	res.json({
		code: 200, 
		msg: 'Hello, Sally', 
		data: null
	}); 
});

module.exports = router;
