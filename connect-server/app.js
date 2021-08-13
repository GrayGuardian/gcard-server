const app = require("../common/app");

app(() => {
    console.log("获得对应的中心服务器配置>>", serverConfig.getCenterServerFromConfig(SERVER_CONFIG));

});