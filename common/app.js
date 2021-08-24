module.exports = async function (cb) {
    global.log = require("./base/log");
    global.util = require("./utils/util");
    global.Template = require("./template/template");
    global.SERVER_TYPE = require("./server/server_type");
    global.SOCKET_EVENT = require("./socket/socket_event");

    global.SocketClient = require("./socket/socket_client");
    global.SocketServer = require("./socket/socket_server");

    global.pb = new (require("./pb/pb"))();

    global.mysqlMgr = new (require("./db/mysql_mgr"))();
    global.mySqlLogic = new (require("./db/mysql_logic"))();

    global.serverConfig = new (require("./server/server_config"))();
    global.serverConfig.create(await mySqlLogic.getAllServerConfigs())

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