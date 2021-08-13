const app = require("../common/app");

app(() => {
    const S2CServer = require("../common/s2s/s2s_server");

    let server = new S2CServer(SERVER_CONFIG.host, SERVER_CONFIG.port)
    server.listen(() => {
        log.print(`服务器创建成功 ${SERVER_NAME} ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    });


});