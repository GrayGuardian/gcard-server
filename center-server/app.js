const app = require("../common/base/app");

app(() => {
    global.s2sRouter = new (require('./router/s2s_router'));

    global.s2sServer = new S2SServer(SERVER_CONFIG.host, SERVER_CONFIG.port)
    s2sServer.listen(() => {
        log.print(`转发服务器创建成功 ${SERVER_NAME} ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    });


});