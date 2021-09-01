const app = require("../common/base/app");

app(() => {
    global.s2sRouter = new (require('./router/s2s_router'))();

    let config = serverConfig.getCenterServerFromName(SERVER_NAME);
    global.s2sClient = new S2SClient(config);
    s2sClient.connect(
        () => {
            log.print(`转发服务器[${s2sClient.config.name}]连接成功`);
            // s2sClient.rpc("http-server0", 'test', null).then((data) => { console.log("接收回调testRet", data) })
        },
        () => {
            log.error(`转发服务器[${s2sClient.config.name}]连接失败 ${s2sClient.config.host}:${s2sClient.config.port}`);
        }
    );

    const HttpServer = require("../common/http/http_server")
    global.httpServer = new HttpServer(SERVER_CONFIG.host, SERVER_CONFIG.port);
    httpServer.use(require('./filter/method'));
    httpServer.use(require('./filter/data'));
    httpServer.use(require('./filter/token'));
    httpServer.use(require('./filter/router'));

    httpServer.listen(() => {
        log.print(`Http服务器创建成功 ${SERVER_NAME} http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    })

});