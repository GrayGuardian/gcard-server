


var Server = function (host, ip) {
    this.server = new SocketServer(host, ip)
}
Server.prototype.listen = function (cb) {
    if (SERVER_CONFIG.type != ServerType.Center) {
        log.error("该服务器不是中心服务器，无法进行转发")
        return;
    }

    this.server.listen(() => {

        if (cb != null) cb();
    });
}
module.exports = Server;