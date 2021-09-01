var SocketClient = function (host, port, token) {
    this.host = host;
    this.port = port;
    this.token = token

    this.client = new global.SocketClient(this.host, this.port)
    this.client.use(global.SocketClient.EVENT_TYPE.OnConnectSuccess, async (ctx, next) => {

        this.send('conn', { token: this.token });
    })
    this.client.use(global.SocketClient.EVENT_TYPE.OnReceive, async (ctx, next) => {
        let dataPack = pb.decode('socket.rpc', ctx.dataPack.data);
        let router = dataPack.router;
        let data = dataPack[router];

        broadcast.notify(`SOCKET_CLIENT_${router}`, data);
        console.log(router, ">>>", data);
    })
    this.client.use(global.SocketClient.EVENT_TYPE.OnDisConnect, async (ctx, next) => {
        log.error("SocketClient Error >>> 断开连接");
    })
}

SocketClient.prototype.connect = function (success, error) {
    this.client.connect(
        () => {
            this.on('connRet', () => {
                if (success != null) success();
            }, 0, true)
        },
        () => {
            if (error != null) error();
        }
    )
}
SocketClient.prototype.send = function (router, data) {
    let s2sdata = {};
    s2sdata.router = router;
    s2sdata[router] = data;
    this.client.send(SOCKET_EVENT.DATA,
        pb.encode("socket.rpc", s2sdata)
    )
}
SocketClient.prototype.on = function (router, callback, order, isOnce) {
    return broadcast.on(`SOCKET_CLIENT_${router}`, callback, order, isOnce);
}
SocketClient.prototype.out = function (router, callback) {
    return broadcast.out(`SOCKET_CLIENT_${router}`, callback);
}

module.exports = SocketClient;



