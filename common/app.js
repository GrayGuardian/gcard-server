module.exports = async function (cb) {
    global.pb = new (require("./pb/pb"))();
    global.log = require("./base/log");
    global.ServerType = require("./server/server_type");;

    global.SocketClient = require("./socket/socket_client");
    global.SocketServer = require("./socket/socket_server");

    global.mysqlMgr = new (require("./db/mysql_mgr"))();
    global.mySqlLogic = new (require("./db/mysql_logic"))();

    global.serverConfig = new (require("./server/server_config"))();
    global.serverConfig.create(await mySqlLogic.getAllServerConfigs())

    //服务器配置获取
    var arg = process.argv;
    var arr = arg[1].split('\\');
    global.SERVER_TYPE = arr[arr.length - 2];
    global.SERVER_ORDER = Number(arg.splice(2));
    global.SERVER_NAME = `${SERVER_TYPE}${SERVER_ORDER}`;
    global.SERVER_CONFIG = serverConfig.getServerFromName(SERVER_NAME)

    if (SERVER_CONFIG == null) {
        log.error(`服务器配置不存在 >>> ${SERVER_NAME}`)
        return;
    }
    // console.log(SERVER_TYPE, SERVER_ORDER, SERVER_NAME, SERVER_CONFIG);

    cb();
}