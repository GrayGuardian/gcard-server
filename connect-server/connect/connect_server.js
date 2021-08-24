const ConnectClient = require("./connect_client");
var Server = function (host, port) {
    this.clientMap = {};

    this.server = new SocketServer(host, port);

    const method = require("../filter/method");
    const router = require("../filter/router");

    this.server.use(SocketServer.EVENT_TYPE.OnConnect, method);
    this.server.use(SocketServer.EVENT_TYPE.OnDisconnect, method);
    this.server.use(SocketServer.EVENT_TYPE.OnReceive, method);
    this.server.use(SocketServer.EVENT_TYPE.OnSend, method);

    this.server.use(SocketServer.EVENT_TYPE.OnReceive, router);

    this.server.use(SocketServer.EVENT_TYPE.OnDisconnect, async (ctx, next) => {
        await this.onClientLeave(ctx.socket);
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
Server.prototype.onClientEnter = async function (idx, socket) {
    let client = this.clientMap[idx];
    if (client != null) {
        // 顶号处理逻辑
        client.genError(Template.template_error_code.REPEAT_LOGIN);
        client.kickOut();
        client.close();
    }
    this.clientMap[idx] = new ConnectClient(this, idx, socket)

    await serverLogic.playerEnter(idx);
}
Server.prototype.onClientLeave = async function (socket) {
    let idx = Object.keys(this.clientMap).find(key => { return this.clientMap[key].socket == socket })
    let client = this.clientMap[idx]
    if (idx != null && client != null) {
        await serverLogic.playerLeave(idx);
        client.close();
    }
}
Server.prototype.genError = function (socket, errorCode, cb) {
    errorCode = Template.template_error_code[errorCode.code];
    if (errorCode == null || util.equalErrorCode(errorCode, SUCCESS_CODE)) {
        log.error(`不可设置的错误码 code:${errorCode.code}`);
        return;
    }
    return this.send(socket, "error", { code: errorCode }, cb);
}
Server.prototype.send = function (socket, router, data, cb) {
    data = data ?? {};
    let dataPack = {}
    dataPack.router = router;
    dataPack[router] = data;
    let buff = pb.encode("socket.rpc", dataPack);
    if (!pb.check("socket.rpc", buff, dataPack)) {
        this.genError(socket, Template.template_error_code.RET_DATA_ERROR);
        return false;
    }
    log.print(`[socket] [s2c] >>> [${router}] ${JSON.stringify(data)}`)
    this.server.send(socket, SOCKET_EVENT.DATA, buff, cb)
    return true;
}
Server.prototype.kickOut = function (socket) {
    this.server.kickOut(socket);
}
module.exports = Server