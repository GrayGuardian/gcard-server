const app = require("../common/app");

app(() => {
    global.s2sRouter = new (require('./router/s2s_router'))();


    const S2SClient = require("../common/s2s/s2s_client");
    let config = serverConfig.getCenterServerFromName(SERVER_NAME);
    global.s2sClient = new S2SClient(config);
    s2sClient.connect(
        () => {
            log.print(`转发服务器[${s2sClient.config.name}]连接成功`);
            s2sClient.rpc("http-server1", 'test', null, () => { console.log("接收回调testRet") })
        },
        () => {
            log.error(`转发服务器[${s2sClient.config.name}]连接失败 ${s2sClient.config.host}:${s2sClient.config.port}`);
        }
    );

});