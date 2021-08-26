module.exports = async function () {
    // 常量
    global.SOCKET_EVENT = require("../const/SOCKET_EVENT");
    global.BROADCAST_CODE = require("../const/BROADCAST_CODE");
    global.REGULAR_CODE = require("../const/REGULAR_CODE");
    global.GAME_CONST = require("../const/GAME_CONST");
    global.S2S_TYPE = require("../const/S2S_TYPE");
    // 类
    global.SocketClient = require("../socket/socket_client");
    global.SocketServer = require("../socket/socket_server");
    // 静态类
    global.log = require("../utils/log");
    global.util = require("../utils/util");
    global.Template = require("../template/template");
    global.ERROR_INFO = Template.template_error_info;

    // 实例化对象
    global.pb = new (require("../utils/pb"))();
    global.broadcast = new (require("../utils/broadcast"))();

    global.mysqlMgr = new (require("../db/mysql_mgr"))();
    global.mySqlLogic = new (require("../db/mysql_logic"))();

    global.serverConfig = new (require("../server/server_config"))();
    global.serverConfig.create(await mySqlLogic.getAllServerConfigs())
}