const app = require("../common/base/app");

app(() => {
    global.serverLogic = new (require('./common/server_logic'))();
    global.s2sRouter = new (require('./router/s2s_router'))();

    let config = serverConfig.getCenterServerFromName(SERVER_NAME);
    global.s2sClient = new S2SClient(config);
    s2sClient.connect(
        () => {
            log.print(`转发服务器[${s2sClient.config.name}]连接成功`);
        },
        () => {
            log.error(`转发服务器[${s2sClient.config.name}]连接失败 ${s2sClient.config.host}:${s2sClient.config.port}`);
        }
    );

    const ConnectServer = require("./connect/connect_server");
    global.connectServer = new ConnectServer(SERVER_CONFIG.host, SERVER_CONFIG.port);

    connectServer.listen(() => {
        log.print(`网关服务器创建成功 ${SERVER_NAME} ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    });

});