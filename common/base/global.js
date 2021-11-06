
module.exports = async function () {
    require("../util/util");
    // 常量
    global.SOCKET_EVENT = require("../config/SOCKET_EVENT");
    global.EVENT_CODE = require("../config/EVENT_CODE");
    global.REGULAR_CODE = require("../config/REGULAR_CODE");
    global.GAME_CONST = require("../config/GAME_CONST");
    global.S2S_TYPE = require("../config/S2S_TYPE");
    // 类
    global.SocketClient = require("../net/socket/socket_client");
    global.SocketServer = require("../net/socket/socket_server");
    global.S2SServer = require("../s2s/s2s_server");
    global.S2SClient = require("../s2s/s2s_client");

    global.Middleware = require('../tool/middleware')

    global.Model = {};
    global.Model.Player = require("../model/player")
    global.Model.PlayerCurrency = require("../model/player_currency");
    global.Model.PlayerProps = require("../model/player_props");
    // 静态类
    global.log = require("../tool/log");
    global.lock = require("../tool/lock");
    global.Template = require("../template/template");
    global.Template.refresh()
    // 实例化对象
    global.pb = new (require("../pb/pb"))();
    global.jwt = new (require("../tool/jwt"))();
    global.eventManager = new (require("../tool/event_manager"))();

    global.mysqlMgr = new (require("../db/mysql/mysql_mgr"))();
    global.mysqlLogic = new (require("../db/mysql/mysql_logic"))();
    global.redisMgr = new (require("../db/redis/redis_mgr"))();
    global.redisLogic = new (require("../db/redis/redis_logic"))();
    global.s2sLogic = new (require("../s2s/s2s_logic"))();
    global.modelMgr = new (require("../model/model_mgr"))();

    global.serverConfig = new (require("../config/server_config"))();
    global.serverConfig.create(await mysqlLogic.getAllServerConfigs())
}