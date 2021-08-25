
var Client = function (server, idx, socket) {
    this.server = server;
    this.idx = idx;
    this.socket = socket;

    this.channels = [];
    this.sendEvent = (data) => { this.send(data.router, data.data, data.cb) }

    // 添加pid发送广播事件
    broadcast.on(BROADCAST_CODE.SOCKET_ID(this.idx), this.sendEvent);
}
Client.prototype.genError = function (errorCode, cb) {
    return this.server.genError(this.socket, errorCode, cb)
}
Client.prototype.send = function (router, data, cb) {
    return this.server.send(this.socket, router, data, cb)
}
Client.prototype.kickOut = function () {
    this.server.kickOut(this.socket);
}
Client.prototype.close = function () {
    // 清理发送广播事件
    // 清理pid发送广播事件
    broadcast.out(BROADCAST_CODE.SOCKET_ID(this.idx), this.sendEvent);
    // 退出所有频道
    this.channels.forEach(key => {
        this.pullChannel(key);
    });
    // 删除自身
    if (this.server.clientMap[this.idx] != null) {
        delete this.server.clientMap[this.idx];
    }
}
// 加入频道
Client.prototype.pushChannel = function (key) {
    let flag = broadcast.on(BROADCAST_CODE.SOCKET_CHANNEL(key), this.sendEvent);
    if (flag) {
        this.channels.push(key);
    }
    return flag;
}
// 退出频道
Client.prototype.pullChannel = function (key) {
    let index = this.channels.indexOf(key)
    let flag = false;
    if (index != -1) {
        flag = broadcast.out(BROADCAST_CODE.SOCKET_CHANNEL(key), this.sendEvent);
        if (flag) {
            this.channels.splice(index, 1);
        }
        return flag;
    }
    return false;
}
module.exports = Client;

