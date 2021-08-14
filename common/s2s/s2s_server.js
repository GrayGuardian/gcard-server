var Server = function (host, ip) {
    this.server = new SocketServer(host, ip)
}
Server.prototype.listen = function (cb) {
    if (SERVER_CONFIG.type != ServerType.Center) {
        log.error(`[${SERVER_NAME}]不是中心服务器，无法创建转发服务器`)
        return;
    }

    this.server.listen(() => {

        if (cb != null) cb();
    });
}
module.exports = Server;