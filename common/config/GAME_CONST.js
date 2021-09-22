var GAME_CONST = {}

// 服务器类型
GAME_CONST.SERVER_TYPE = {
    // 中心转发服务器
    CENTER: 0,
    // 网关服务器
    CONNECT: 1,
    // http服务器
    HTTP: 2,
    // 游戏服务器
    GAME: 3,
}

// Model类型/clsName
GAME_CONST.MODEL_TYPE = {
    // 玩家
    PLAYER: 'Player',
    // 玩家货币
    PLAYER_CURRENCY: "PlayerCurrency",
    // 玩家道具
    PLAYER_PROPS: "PlayerProps",
}

// 游戏区服状态
GAME_CONST.AREA_STATE = {
    NORMAL: 0,      // 正常
    MAINTAIN: 1,    // 维护
    INVALID: 2,     // 无效 删除/合服
}
// 用户状态
GAME_CONST.USER_STATE = {
    NORMAL: 0,      // 正常
    DELETE: 1,      // 删除
    BAN: 2,         // 封号
}
// 玩家状态
GAME_CONST.PLAYER_STATE = {
    NORMAL: 0,      // 正常
    DELETE: 1,      // 删除
}
// 货币类型 对应db.game.player_currency的字段
GAME_CONST.PLAYER_CURRENCY_TYPE = {
    COPPER: 'currency0',    // 铜币
    SILVER: 'currency1',    // 银币
}
// 道具状态
GAME_CONST.PLAYER_PROPS_STATE = {
    NORMAL: 0,      // 正常
    DELETE: 1,      // 已删除
}

module.exports = GAME_CONST;