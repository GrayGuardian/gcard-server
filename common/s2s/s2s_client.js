const S2SType = require("./s2s_type");

var Client = function (config) {
    if (config == null) {
        log.error(`未查找到[${SERVER_NAME}]的中心服务器`);
        return;
    }
    this.code = 0;
    this.config = config;
    this.retCbMap = new Map();

    this.client = new SocketClient(this.config.host, this.config.port)

    this.client.on("onReceive", (dataPack) => { this.onReceive(dataPack) });
}
    ;

Client.prototype.connect = function (success, error) {
    if (this.client == null) return;
    this.client.connect(() => {
        this.rpc(this.config.name, "conn", { config: SERVER_CONFIG }, (s2sdata, data) => {
            if (data.code == SUCCESS_CODE) {
                this.rpc(SERVER_NAME, 'test', null, () => { console.log("接收回调testRet") })
                if (success != null) success(this);
            }
            else {
                if (error != null) error(this);
            }
        });
    }, () => {
        if (error != null) error(this);
    })
}
Client.prototype.rpc = function (to, router, data, cb) {
    if (this.client == null) return;
    data = data ?? {};
    let s2sdata = {};
    s2sdata.code = this.code++;
    s2sdata.from = SERVER_NAME;
    s2sdata.to = to;
    s2sdata.router = router;
    s2sdata[router] = data;
    s2sdata.type = S2SType.S2S;

    if (cb != null) {
        this.retCbMap.set(s2sdata.code, cb);
    }

    this.send(s2sdata);

}
Client.prototype.send = function (s2sdata) {
    if (this.client == null) return;

    s2sdata[s2sdata.router] = s2sdata[s2sdata.router] ?? {};
    log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(s2sdata[s2sdata.router])}`)

    let buff = pb.encode("s2s.rpc", s2sdata);
    this.client.send(SocketEvent.sc_send, buff);
}



Client.prototype.onReceive = function (dataPack) {
    let s2sdata = pb.decode("s2s.rpc", dataPack.data);
    if (s2sdata == null) {
        log.error("转发数据格式出错");
        return;
    }
    let data = s2sdata[s2sdata.router];

    // 首次接收
    if (s2sdata.type == S2SType.S2S) {
        if (s2sdata.to == SERVER_NAME) {
            let fun = s2sRouter[s2sdata.router];
            if (fun != null) {
                log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(data)}`)
                let next = (retdata) => {
                    let router = `${s2sdata.router}Ret`
                    let tdata = { code: s2sdata.code, from: SERVER_NAME, to: s2sdata.from, router: router, type: S2SType.S2SRet };
                    tdata[router] = retdata

                    this.send(tdata)
                }
                fun(this.client, s2sdata, data, next);
            }
        }
        return;
    }
    // 回调
    if (s2sdata.type == S2SType.S2SRet) {
        if (s2sdata.to == SERVER_NAME) {
            log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(data)}`)
            let fun = this.retCbMap.get(s2sdata.code)
            if (fun != null) {
                fun(s2sdata, data);
                this.retCbMap.delete(s2sdata.code);
            }
        }
        return;
    }

}


module.exports = Client;