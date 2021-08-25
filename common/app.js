module.exports = async function (cb) {
    // 常量
    global.SOCKET_EVENT = require("./const/SOCKET_EVENT");
    global.S2S_TYPE = require("./const/S2S_TYPE");
    global.SERVER_TYPE = require("./const/SERVER_TYPE");
    global.BROADCAST_CODE = require("./const/BROADCAST_CODE");
    // 类
    global.SocketClient = require("./socket/socket_client");
    global.SocketServer = require("./socket/socket_server");
    // 静态类
    global.log = require("./utils/log");
    global.util = require("./utils/util");
    global.Template = require("./template/template");

    global.SUCCESS_CODE = Template.template_error_code.SUCCESS

    // 实例化对象
    global.pb = new (require("./pb/pb"))();
    global.broadcast = new (require("./utils/broadcast"))();

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