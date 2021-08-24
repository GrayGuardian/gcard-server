var Server = function (host, port) {
    this.server = new SocketServer(host, port);

    const method = require("../filter/method");
    const router = require("../filter/router");

    this.server.use(SocketServer.EVENT_TYPE.OnConnect, method);
    this.server.use(SocketServer.EVENT_TYPE.OnDisconnect, method);
    this.server.use(SocketServer.EVENT_TYPE.OnReceive, method);
    this.server.use(SocketServer.EVENT_TYPE.OnSend, method);

    this.server.use(SocketServer.EVENT_TYPE.OnReceive, router);




    this.server.use(SocketServer.EVENT_TYPE.OnConnect, async (ctx, next) => {
        log.print("用户进入");
        await next();
    })

    this.server.use(SocketServer.EVENT_TYPE.OnDisconnect, async (ctx, next) => {
        log.print("用户退出");
        await next();
    })


    this.server.use(SocketServer.EVENT_TYPE.OnError, async (ex, next) => {
        log.error(ex);
        await next();
    })
}
Server.prototype.listen = function (cb) {
    this.server.listen(cb);
}
module.exports = Server