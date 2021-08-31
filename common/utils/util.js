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
Util.toJson = function (object, name) {
    var result = "";
    function serializeInternal(o, path) {
        for (p in o) {
            var value = o[p];
            if (value == null) {
                result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "null;";
            }
            else {
                if (typeof value != "object") {
                    if (typeof value == "string") {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "] = " + "\"" + value.replace(/\"/g, "\\\"") + "\"" + ";";
                    } else {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "] = " + value + ";";
                    }
                }
                else {
                    if (value instanceof Array) {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "new Array();";
                        serializeInternal(value, path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]");
                    } else {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "new Object();";
                        serializeInternal(value, path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]");
                    }
                }
            }
        }
    }
    serializeInternal(object, name);
    return result;
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
        return data;
    } catch (e) {
        // token超时过期也会报错
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