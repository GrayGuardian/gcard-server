


var Server = function (host, ip) {
    this.server = new SocketServer(host, ip)
}
Server.prototype.listen = function (cb) {
    if (SERVER_CONFIG.type != ServerType.Center) {

        return;
    }

    this.server.listen(() => {

        if (cb != null) cb();
    });
}
module.exports = Server;