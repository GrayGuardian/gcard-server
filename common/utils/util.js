var Util = {};
Date.unix = function () {
    return Math.floor(Date.now() / 1000);
}

Util.equalErrorInfo = function (info1, info2) {
    return info1.code == info2.code;
}

Util.equalObjectValue = function (obj1, obj2) {
    return JSON.stringify(obj1) == JSON.stringify(obj2);
}
// 封装Error数据
Util.getError = function (type, info, data) {
    info.tip = info[`${type == 0 ? 'client' : 'server'}Tip`]
    let dataPack = { info: info }
    if (data != null) {
        dataPack.data = {
            [info.code]: data
        }
    }
    return dataPack
}

const JWT = require('jsonwebtoken');
const TokenKey = '851a028465fc4f62bc4f8451347c9eff'
Util.tokenSerialize = function (data, time) {
    time = time == null ? '1d' : time;
    return JWT.sign(data, TokenKey, { expiresIn: time })
}
Util.tokenDeserialize = function (token) {
    try {
        let data = JWT.verify(token, TokenKey);
        if (data.exp < Date.unix()) {
            //Token过期
            return null;
        }
        return data;
    } catch (e) {
        return null
    }
}

const MD5 = require('md5-node')
Util.md5 = function (content) {
    content = typeof (content) == 'string' ? content : JSON.stringify(content);
    return MD5(content);
}

const UUID = require('uuid');
Util.uuid = function () {
    return UUID.v1();
}


module.exports = Util;