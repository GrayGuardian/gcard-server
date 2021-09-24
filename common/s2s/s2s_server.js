
const S2SClient = require("./s2s_client");
var Server = function (host, port) {
    if (SERVER_CONFIG.type != GAME_CONST.SERVER_TYPE.CENTER) {
        log.error(`[${SERVER_NAME}]不是中心服务器，无法创建转发服务器`)
        return;
    }
    this.clientMap = new Map();
    this.s2sClientMap = new Map();
    this.server = new SocketServer(host, port)

    this.server.use(SocketServer.EVENT_TYPE.OnError, async (ex, next) => { log.error(ex); await next(); });

    this.server.use(SocketServer.EVENT_TYPE.OnReceive, async (ctx, next) => {
        ctx.send = (s2sdata) => {
            this.send(s2sdata);
        }
        await next();
    })
    this.server.use(SocketServer.EVENT_TYPE.OnReceive, require("./filter/method"));
    this.server.use(SocketServer.EVENT_TYPE.OnReceive, require("./filter/data"));
    this.server.use(SocketServer.EVENT_TYPE.OnReceive, require("./filter/router_server"));
}
Server.prototype.listen = function (cb) {
    if (this.server == null) return;

    this.server.listen(() => {
        if (cb != null) cb();
    });
}

Server.prototype.send = function (s2sdata) {
    s2sdata[s2sdata.router] = s2sdata[s2sdata.router] || {};
    log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(s2sdata[s2sdata.router])}`)
    let buff = pb.encode("s2s.rpc", s2sdata);
    client = this.clientMap.get(s2sdata.to)
    if (client != null) {
        // 本地回发
        this.server.send(client, SOCKET_EVENT.DATA, buff)
    }
    else {
        // 查找对应的中心服务器二次转发
        let config = serverConfig.getCenterServerFromName(s2sdata.to);
        if (config == null) {
            log.error(`未查找到[${SERVER_NAME}]的中心服务器`);
            return;
        }
        if (config.name == SERVER_NAME) {
            log.error(`[${s2sdata.to}]未连接中心服务器[${config.name}]`);
            return;
        }
        // 二次转发逻辑
        let tsend;
        tsend = () => {
            let s2sClient = this.s2sClientMap.get(config.name);
            if (s2sClient != null) {
                s2sClient.send(s2sdata);
            }
            else {
                s2sClient = new S2SClient(config);
                s2sClient.connect(
                    () => {
                        log.print(`转发服务器[${s2sClient.config.name}]连接成功`);
                        this.s2sClientMap.set(s2sClient.config.name, s2sClient);
                        tsend();
                    },
                    () => {
                        log.error(`转发服务器[${s2sClient.config.name}]连接失败 ${s2sClient.config.host}:${s2sClient.config.port}`);
                    }
                );
            }
        }
        tsend();

    }

}

module.exports = Server;