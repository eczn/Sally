let errTable = {
    "5000": "服务器内部错误", 
    "5001": "数据库内部错误", 
    "4000": "数据有误",
    "4002": "账号密码错误", 
    "9999": "未知错误", 
    "4001": "请登陆", 
    "2000": "成功"
}

let rps = {}; 

module.exports = rps;

rps.send = (res, code, data) => {
    let msg = errTable[code] || '未定义的错误码'
    return res.json({
        code, 
        data,
        msg
    }); 
}

rps.of = res => (code, data) => rps.send(res, code, data); 
