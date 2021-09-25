var Client = function (config) {
    if (config == null) {
        log.error(`未查找到[${SERVER_NAME}]的中心服务器`);
        return;
    }
    this.code = 0;
    this.config = config;
    this.retFuncMap = new Map();

    this.client = new SocketClient(this.config.host, this.config.port)

    this.client.use(SocketClient.EVENT_TYPE.OnError, async (ex, next) => { log.error(ex); await next(); });


    this.client.use(SocketClient.EVENT_TYPE.OnReceive, async (ctx, next) => {
        ctx.onRetFunc = (s2sdata) => {
            let code = s2sdata.code;
            let router = s2sdata.router;
            let data = s2sdata[router];
            let fun = this.retFuncMap.get(code)
            if (fun != null) {
                fun({ code: code, router: router, data: data, s2sdata: s2sdata });
                this.retFuncMap.delete(code);
            }
        }
        ctx.send = (s2sdata) => {
            this.send(s2sdata);
        }
        await next();
    })
    this.client.use(SocketClient.EVENT_TYPE.OnReceive, require("./filter/method"));
    this.client.use(SocketClient.EVENT_TYPE.OnReceive, require("./filter/data"));
    this.client.use(SocketClient.EVENT_TYPE.OnReceive, require("./filter/router_client"));
}

Client.prototype.connect = function (success, error) {
    if (this.client == null) return;
    this.client.connect(() => {
        this.rpc(this.config.name, "conn", { config: SERVER_CONFIG }).then((data) => {
            if (success != null) success(this);
        });
    }, () => {
        if (error != null) error(this);
    })
}
Client.prototype.rpc = function (to, router, data) {
    return new Promise((resolve) => {
        if (this.client == null) return;
        data = data || {};
        let s2sdata = {};
        s2sdata.code = this.code++;
        s2sdata.from = SERVER_NAME;
        s2sdata.to = to;
        s2sdata.router = router;
        s2sdata[router] = data;
        s2sdata.type = S2S_TYPE.RPC;

        this.retFuncMap.set(s2sdata.code, (s2sdata) => { resolve(s2sdata); });

        this.send(s2sdata);
    });
}

Client.prototype.send = function (s2sdata) {
    if (this.client == null) return;

    s2sdata[s2sdata.router] = s2sdata[s2sdata.router] || {};
    log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(s2sdata[s2sdata.router])}`)

    let buff = pb.encode("s2s.rpc", s2sdata);
    this.client.send(SOCKET_EVENT.DATA, buff);
}




module.exports = Client;