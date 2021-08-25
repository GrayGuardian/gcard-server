var Util = {};
Date.unix = function () {
    return Math.floor(Date.now() / 1000);
}
Util.equalObjectValue = function (obj1, obj2) {
    return JSON.stringify(obj1) == JSON.stringify(obj2);
}



module.exports = Util;