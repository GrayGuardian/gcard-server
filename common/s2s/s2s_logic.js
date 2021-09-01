var S2SLogic = function () { }

// connect-server to game-server >>> 处理玩家进入相关逻辑
S2SLogic.prototype.playerEnter = async function (player) {
    let aid = player.aid;
    let config = serverConfig.getGameServerFromAid(aid);
    await s2sClient.rpc(config.name, 'playerEnter', { player: player });

}
// connect-server to game-server >>> 处理玩家退出相关逻辑
S2SLogic.prototype.playerLeave = async function (pid) {
    let aid = await redisLogic.getPlayerAid(pid);
    let config = serverConfig.getGameServerFromAid(aid);
    await s2sClient.rpc(config.name, 'playerLeave', { pid: pid });
}

// all to game-server >>> 获取PlayerModel   需要进行修改操作时，注意加分布式锁lock
S2SLogic.prototype.getPlayerModel = async function (pid, data) {
    let aid = await redisLogic.getPlayerAid(pid);
    let config = serverConfig.getGameServerFromAid(aid);
    let s2sdata = { pid: pid };
    if (data != null) {
        s2sdata.data = data;
    }
    let json = ((await s2sClient.rpc(config.name, 'getPlayerModel', s2sdata)).data.jsonBuff).toString("utf8");
    let model = await Model.Player.jsonParse(json)
    return model;
}

module.exports = S2SLogic;