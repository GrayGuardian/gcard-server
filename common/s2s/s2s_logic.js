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

// connect-server to all >>> 转发Socket请求
S2SLogic.prototype.socketRpc = async function (server, dataPack) {
    let result = (await s2sClient.rpc(server, 'socketRpc', dataPack)).data;
    return result;
}


// all to game-server >>> 获取PlayerModel   需要进行修改操作时，注意加分布式锁lock
S2SLogic.prototype.getPlayerModel = async function (pid, data) {
    let aid = await redisLogic.getPlayerAid(pid);
    let config = serverConfig.getGameServerFromAid(aid);
    let dataPack = { pid: pid };
    if (data != null) {
        dataPack.data = data;
    }
    let json = ((await s2sClient.rpc(config.name, 'getPlayerModel', dataPack)).data.jsonBuff).toString("utf8");
    let model = await Model.Player.jsonParse(json)
    return model;
}
// all to connect-server >>> 踢出指定idx连接
S2SLogic.prototype.kickOutFromIdx = async function (idx) {
    let aid = await redisLogic.getPlayerAid(idx);
    let config = serverConfig.getConnectServerFromAid(aid);
    let result = (await s2sClient.rpc(config.name, 'kickOutFromIdx', { idx: idx })).data;
    return result.flag;
}

// all to connect-server >>> 加入ID至频道
S2SLogic.prototype.pushIDToChannel = async function (key, idx) {
    let aid = await redisLogic.getPlayerAid(idx);
    let config = serverConfig.getConnectServerFromAid(aid);
    let result = (await s2sClient.rpc(config.name, 'pushIDToChannel', { key: key, idx: idx })).data;
    return result.flag;
}

// all to connect-server >>> 加入ID至频道
S2SLogic.prototype.pullIDToChannel = async function (key, idx) {
    let aid = await redisLogic.getPlayerAid(idx);
    let config = serverConfig.getConnectServerFromAid(aid);
    let result = (await s2sClient.rpc(config.name, 'pullIDToChannel', { key: key, idx: idx })).data;
    return result.flag;
}
// all to connect-server >>> 发送消息至id
S2SLogic.prototype.sendToID = async function (idx, router, data) {
    let aid = await redisLogic.getPlayerAid(idx);
    let config = serverConfig.getConnectServerFromAid(aid);

    let dataPack = {};
    dataPack.router = router;
    dataPack[router] = data;

    let result = (await s2sClient.rpc(config.name, 'sendToID', { idx: idx, data: dataPack })).data;
    return result.flag;
}

S2SLogic.prototype.sendToChannel = async function (key, router, data, servers) {
    let serverConfigs = null;
    if (servers == null) {
        serverConfigs = serverConfig.configTypeMap.get(GAME_CONST.SERVER_TYPE.CONNECT);
    }
    else {
        serverConfigs = [];
        servers.forEach(server => {
            serverConfigs.push(serverConfig.getServerFromName(server));
        });
    }

    let dataPack = {};
    dataPack.router = router;
    dataPack[router] = data;
    let count = 0;
    for (let index = 0; index < serverConfigs.length; index++) {
        const config = serverConfigs[index];
        let result = (await s2sClient.rpc(config.name, 'sendToChannel', { key: key, data: dataPack })).data;
        count += result.count;
    }
    return count;
}


module.exports = S2SLogic;