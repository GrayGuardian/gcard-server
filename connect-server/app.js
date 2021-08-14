const app = require("../common/app");

app(() => {
    const S2SClient = require("../common/s2s/s2s_client");

    global.s2sClient = new S2SClient((config) => {
        log.print(`转发服务器连接成功 ${config.name} ${config.host}:${config.port}`);
    })
});