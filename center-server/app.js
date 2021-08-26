const app = require("../common/base/app");

app(() => {
    global.s2sRouter = new (require('./router/s2s_router'));

    const S2SServer = require("../common/s2s/s2s_server");

    global.s2sServer = new S2SServer(SERVER_CONFIG.host, SERVER_CONFIG.port)
    s2sServer.listen(() => {
        log.print(`转发服务器创建成功 ${SERVER_NAME} ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    });


});