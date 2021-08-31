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
    global.S2SServer = require("../s2s/s2s_server");
    global.S2SClient = require("../s2s/s2s_client");

    global.Middleware = require('../utils/middleware')
    global.Lock = require("../utils/lock");

    global.Model = {};
    global.Model.Player = require("../model/player")
    global.Model.PlayerCurrency = require("../model/player_currency");
    global.Model.PlayerProps = require("../model/player_props");
    // 静态类
    global.log = require("../utils/log");
    global.util = require("../utils/util");

    global.Template = require("../template/template");
    global.ERROR_INFO = Template.template_error_info;

    // 实例化对象
    global.pb = new (require("../utils/pb"))();
    global.broadcast = new (require("../utils/broadcast"))();

    global.mysqlMgr = new (require("../mysql/mysql_mgr"))();
    global.mysqlLogic = new (require("../mysql/mysql_logic"))();
    global.redisMgr = new (require("../redis/redis_mgr"))();
    global.redisLogic = new (require("../redis/redis_logic"))();
    global.s2sLogic = new (require("../s2s/s2s_logic"))();

    global.serverConfig = new (require("../server/server_config"))();
    global.serverConfig.create(await mysqlLogic.getAllServerConfigs())

    //test
    // let player = await Model.Player.create("bvdf1450-058b-11ec-988a-a30baafb095f")
    // let json = player.toJson();
    // console.log(player.currency.get_currency0())
    // let player1 = await Model.Player.jsonParse(json);
    // console.log(player1.currency.get_currency0())

    // console.log(player1.propsMap[30001].tpl);
    // player1.propsMap[30001].set_cnt(999);
    // player1.propsMap[30001].updateDataToDB();

    // new Lock('aaaaa').use((lock) => {
    //     setTimeout(() => {
    //         console.log("延迟操作1");
    //         lock.unlock();
    //     }, 1000);
    // })
    // new Lock("aaaaa").use((lock) => {
    //     console.log("延迟操作2");
    //     lock.unlock();
    // });
    // new Lock("aaaaa").use((lock) => {
    //     console.log("延迟操作3");
    //     // lock.unlock();
    // });
    // new Lock("aaaaa").use((lock) => {
    //     console.log("延迟操作4");
    //     lock.unlock();
    // });
}