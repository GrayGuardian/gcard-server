
// 消息：数据总长度(4byte) + 数据类型(2byte) + 数据(N byte)
const HEAD_DATA_LEN = 4;
const HEAD_TYPE_LEN = 2;
const HEAD_LEN = HEAD_DATA_LEN + HEAD_TYPE_LEN;
let numberToBytes = function (num, count) {
    let bytes = Buffer.alloc(count);
    for (let index = 0; index < count; index++) {
        let n = Math.pow(256, index);
        bytes[index] = Math.floor(num / n) % 256;
    }
    return bytes;
}
let bytesToNumber = function (bytes) {
    let num = 0;
    for (let index = 0; index < bytes.length; index++) {
        let chat = bytes[index];
        let n = Math.pow(256, index);
        num += chat * n;
    }
    return num;
}
var SocketDataPack = function (type, data) {
    this.type = type;
    this.data = data;
    if (type != null) {

        this.buff = this.getBuff(type, data);
    }
}
SocketDataPack.prototype.getBuff = function (type, data) {
    let buff = Buffer.alloc(0);
    let len = data == null ? 0 : data.length;
    let temp = null;
    temp = numberToBytes(len + HEAD_LEN, HEAD_DATA_LEN);
    buff = Buffer.concat([buff, temp]);
    temp = numberToBytes(type, HEAD_TYPE_LEN);
    buff = Buffer.concat([buff, temp]);

    if (data != null) {
        buff = Buffer.concat([buff, data]);
    }
    return buff;
}
SocketDataPack.Unpack = function (buff) {
    if (buff.length < HEAD_LEN) {
        // 头部没取完则返回
        return null
    }
    let temp = null
    // 取数据长度
    temp = Buffer.alloc(HEAD_DATA_LEN);
    buff.copy(temp, 0, 0, HEAD_DATA_LEN);
    let buffLength = bytesToNumber(temp);

    if (buffLength <= 0) return null;
    if (buffLength > buff.length) {
        // 数据没取完
        return null;
    }
    let dataLength = buffLength - HEAD_LEN;
    // console.log("buffLength", buffLength, "dataLength", dataLength);
    // 取数据类型
    temp = Buffer.alloc(HEAD_TYPE_LEN);
    buff.copy(temp, 0, HEAD_DATA_LEN, HEAD_LEN);
    let dataType = bytesToNumber(temp);
    // 取类型
    let data = Buffer.alloc(dataLength);
    buff.copy(data, 0, HEAD_LEN, buffLength);


    return new SocketDataPack(dataType, data);
}

module.exports = SocketDataPack