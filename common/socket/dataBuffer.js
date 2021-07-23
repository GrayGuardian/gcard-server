const SocketDataPack = require("./socketDataPack");

var DataBuffer = function () {
    this.buff = Buffer.alloc(0);
}
DataBuffer.prototype.addBuffer = function (data) {

    this.buff = Buffer.concat([this.buff, data])
}
DataBuffer.prototype.TryUnpack = function () {
    let dataPack = SocketDataPack.Unpack(this.buff);
    if (dataPack != null) {
        this.buff = this.buff.slice(dataPack.buff.length, this.buff.length)
    }
    return dataPack;
}
module.exports = DataBuffer
