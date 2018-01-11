// index.js
const jwt = require('jsonwebtoken')
    , SECRET = `This_Is_Secret_Key`

let auth = {}; 

auth.en = function(data = {}){
	let token = jwt.sign({
		// 一个钟 
		exp: Math.floor(Date.now() / 1000) + 99000000, 
		data: data
	}, SECRET);

	return token; 
}

auth.de = function(token){
	let data;

    // 否则尝试解开 
    try {
        opt = jwt.verify(token, SECRET);
        
        return opt.data; 
    } catch (err) {
        return null; 
    }
}

module.exports = auth; 