var S2SLogic = function () { }

// 转发到对应的游戏服务器处理玩家进入触发
S2SLogic.prototype.playerEnter = async function (player) {
    let aid = player.aid;
    let config = serverConfig.getGameServerFromAid(aid);
    console.log('转发到', config)
    if (config.name == SERVER_NAME) {
        // 无需转发
        await serverLogic.playerEnter(player);
    }
    else {
        // 需要转发
        await s2sClient.rpc(config.name, 'playerEnter', { player: player });
    }
}
// 转发到对应的游戏服务器处理玩家退出触发
S2SLogic.prototype.playerLeave = async function (pid) {

}

module.exports = S2SLogic;