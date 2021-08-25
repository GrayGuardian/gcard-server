var GAME_CONST = {}

// 服务器类型
GAME_CONST.SERVER_TYPE = {
    // 中心转发服务器
    CENTER: 0,
    // 网关服务器
    CONNECT: 1,
    // http服务器
    HTTP: 2,
}

// 游戏区服状态
GAME_CONST.AREA_STATE = {
    NORMAL: 0,  // 正常
    MAINTAIN: 1,    // 维护
    INVALID: 2, // 无效 删除/合服
}

// 玩家状态
GAME_CONST.PLAYER_STATE = {
    NORMAL: 0,  // 正常
    DELETE: 1,   // 删除
    BAN: 2, // 封号
}

module.exports = GAME_CONST;