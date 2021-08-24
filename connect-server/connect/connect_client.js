var Client = function (server, idx, socket) {
    this.server = server;
    this.idx = idx;
    this.socket = socket;
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

    // 删除自身
    if (this.server.clientMap[this.idx] != null) {
        delete this.server.clientMap[this.idx];
    }
}
module.exports = Client;

