
let pbroot = require("protobufjs").Root;

var PB = function () { }

PB.prototype.getMessage = function (key) {
    let keys = key.split('.')
    let json = require(`./${keys[0]}_pb.json`);
    let root = pbroot.fromJSON(json);
    let Message = root.lookupType(keys[1]);
    return Message
}

PB.prototype.encode = function (key, data) {
    try {
        let Message = this.getMessage(key);
        return Message.encode(Message.create(data)).finish();
    } catch (error) {
        return null;
    }

}
PB.prototype.decode = function (key, data) {
    try {
        let Message = this.getMessage(key);
        return Message.decode(data);
    } catch (error) {
        return null;
    }
}
PB.prototype.check = function (key, buff, data) {
    try {
        let str1 = JSON.stringify(this.decode(key, buff));
        let str2 = JSON.stringify(data)

        return str1 == str2;
    } catch (error) {
        return false;
    }
}

module.exports = PB