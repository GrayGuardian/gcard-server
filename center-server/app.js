const app = require("../common/app");

app(() => {
    const S2SServer = require("../common/s2s/s2s_server");

    let server = new S2SServer(SERVER_CONFIG.host, SERVER_CONFIG.port)
    server.listen(() => {
        log.print(`转发服务器创建成功 ${SERVER_NAME} ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    });


});