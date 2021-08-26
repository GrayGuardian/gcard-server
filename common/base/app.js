module.exports = async function (cb) {
    await require("./global")();

    //服务器配置获取
    var arg = process.argv;
    var arr = arg[1].split('\\');
    global.SERVER_ORDER = Number(arg.splice(2))
    global.SERVER_NAME = `${arr[arr.length - 2]}${SERVER_ORDER}`;
    global.SERVER_CONFIG = serverConfig.getServerFromName(SERVER_NAME)

    if (SERVER_CONFIG == null) {
        log.error(`服务器配置不存在 >>> ${SERVER_NAME}`)
        return;
    }

    cb();
}