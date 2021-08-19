const S2SType = require("./s2s_type");

var Server = function (host, ip) {
    if (SERVER_CONFIG.type != ServerType.Center) {
        log.error(`[${SERVER_NAME}]不是中心服务器，无法创建转发服务器`)
        return;
    }
    this.clientMap = new Map();
    this.server = new SocketServer(host, ip)
    this.server.on("onReceive", (socket, dataPack) => { this.onReceive(socket, dataPack) });
    this.server.on("onError", (ex) => { log.error(ex) });
}
Server.prototype.listen = function (cb) {
    if (this.server == null) return;

    this.server.listen(() => {
        if (cb != null) cb();
    });
}

Server.prototype.onReceive = function (socket, dataPack) {
    let s2sdata = pb.decode("s2s.rpc", dataPack.data);
    if (s2sdata == null) {
        log.error("转发数据格式出错");
        return;
    }
    let data = s2sdata[s2sdata.router];
    if (s2sdata.type == S2SType.S2S && s2sdata.to == SERVER_NAME) {
        // 本地操作
        let fun = s2sRouter[s2sdata.router];
        if (fun != null) {
            log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(data)}`)
            let next = (retdata) => {
                let router = `${s2sdata.router}Ret`
                let tdata = { code: s2sdata.code, from: SERVER_NAME, to: s2sdata.from, router: router, type: S2SType.S2SRet };
                tdata[router] = retdata

                this.send(tdata)
            }
            fun(socket, s2sdata, data, next);
        }
        return;
    }

    // 转发操作
    console.log("转发>>", s2sdata.type, s2sdata.router)
    this.send(s2sdata)
}
Server.prototype.send = function (s2sdata) {
    s2sdata[s2sdata.router] = s2sdata[s2sdata.router] ?? {};
    log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(s2sdata[s2sdata.router])}`)
    let buff = pb.encode("s2s.rpc", s2sdata);
    client = this.clientMap.get(s2sdata.to)
    if (client != null) {
        // 本地转发
        this.server.send(client, SocketEvent.sc_send, buff)
    }
    else {
        // 查找对应的中心服务器二次转发

    }

}

module.exports = Server;