const ConnectClient = require("./connect_client");
var Server = function (host, port) {
    this.clientMap = {};

    this.server = new SocketServer(host, port);

    const method = require("../filter/method");
    const data = require("../filter/data");
    const router = require("../filter/router");

    this.server.use(SocketServer.EVENT_TYPE.OnConnect, method);
    this.server.use(SocketServer.EVENT_TYPE.OnDisconnect, method);
    this.server.use(SocketServer.EVENT_TYPE.OnReceive, method);
    this.server.use(SocketServer.EVENT_TYPE.OnSend, method);

    this.server.use(SocketServer.EVENT_TYPE.OnReceive, data);
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
    // 判断是否已在线
    let client = this.clientMap[idx];
    if (client != null) {
        // 顶号处理逻辑
        // client.genError(ERROR_INFO.REPEAT_LOGIN);
        client.kickOut();
        client.close();

        this.clientMap[idx] = new ConnectClient(this, idx, socket)
    }
    else {
        this.clientMap[idx] = new ConnectClient(this, idx, socket)

        await serverLogic.playerEnter(idx);
    }

}
Server.prototype.onClientLeave = async function (socket) {
    let idx = this.getIdxFromSocket(socket);
    let client = this.clientMap[idx]
    if (idx != null && client != null) {
        await serverLogic.playerLeave(idx);
        client.close();
    }
}
Server.prototype.genError = async function (socket, model, data) {
    model = model ?? ERROR_INFO.UNKNOWN_ERROR
    if (model == null || model.equal(ERROR_INFO.SUCCESS)) {
        log.error(`不可设置的错误码 code:${model.get_code()}`);
        return;
    }
    let dataPack = model.getClientErrorPackage(data);
    return await this.send(socket, "error", dataPack);
}
Server.prototype.send = async function (socket, router, data) {
    data = data ?? {};
    let dataPack = {}
    dataPack.router = router;
    dataPack[router] = data;
    let buff = pb.encode("socket.rpc", dataPack);
    if (!pb.check("socket.rpc", buff, dataPack)) {
        this.genError(socket, ERROR_INFO.RET_DATA_ERROR);
        return null;
    }
    log.print(`[socket] [s2c] >>> [${router}] ${JSON.stringify(data)}`)
    return await this.server.send(socket, SOCKET_EVENT.DATA, buff)
}
Server.prototype.getIdxFromSocket = function (socket) {
    return Object.keys(this.clientMap).find(key => { return this.clientMap[key].socket == socket })
}
Server.prototype.getSocketFromIdx = function (idx) {
    try {
        return this.clientMap[idx].socket;
    }
    catch {
        return null;
    }
}
Server.prototype.kickOut = async function (socket) {
    await this.server.kickOut(socket);
}
Server.prototype.kickOutAll = async function () {
    await this.server.kickOutAll();
}
// 踢出指定idx连接
Server.prototype.kickOutFromIdx = async function (idx) {
    let socket = this.getSocketFromIdx(idx);
    if (socket == null) {
        log.error("kickOutFromIdx Error >> Socket Not Exist")
        return false;
    }
    await this.kickOut(socket);
    return true;
}
// 加入ID至频道
Server.prototype.pushIDToChannel = function (key, idx) {
    if (this.clientMap[idx] == null)
        return false;
    return this.clientMap[idx].pushChannel(key);
}
// 退出ID至频道
Server.prototype.pullIDToChannel = function (key, idx) {
    if (this.clientMap[idx] == null)
        return false;
    return this.clientMap[idx].pullChannel(key);
}
// 发送消息至id
Server.prototype.sendToID = function (idx, router, data) {
    return broadcast.notify(BROADCAST_CODE.SOCKET_ID(idx), { router: router, data: data })
}
// 发送消息至频道
Server.prototype.sendToChannel = function (key, router, data) {
    return broadcast.notify(BROADCAST_CODE.SOCKET_CHANNEL(key), { router: router, data: data })
}
module.exports = Server