var JWT = function () { }

const _JWT = require('jsonwebtoken');
const TokenKey = '851a028465fc4f62bc4f8451347c9eff'

JWT.prototype.encode = function (data, time) {
    time = time == null ? '1d' : time;
    return _JWT.sign(data, TokenKey, { expiresIn: time })
}
JWT.prototype.decode = function (token) {
    try {
        let data = _JWT.verify(token, TokenKey);
        return data;
    } catch (e) {
        // token超时过期也会报错
        return null
    }
}

module.exports = JWT