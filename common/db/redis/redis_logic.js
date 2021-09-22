var RedisLogic = function () { }

// 加锁
RedisLogic.prototype.lock = async function (key, outTime) {
    return await redisMgr.db_game.setnx(`lock:${key}`, true, outTime);
}
// 解锁
RedisLogic.prototype.unlock = async function (key) {
    return await redisMgr.db_game.delete(`lock:${key}`);
}
// 续期锁
RedisLogic.prototype.extendedLock = async function (key, outTime) {
    return await redisMgr.db_game.expire(`lock:${key}`, outTime)
}
// 判断锁是否存在
RedisLogic.prototype.existLock = async function (key) {
    return await redisMgr.db_game.exist(`lock:${key}`)
}
// 获取玩家区服
RedisLogic.prototype.getPlayerAid = async function (pid) {
    let aid = await redisMgr.db_game.get(`pid=${pid}:aid`)
    if (aid != null) {
        return aid;
    }
    let info = await mysqlLogic.getPlayerInfo(pid);
    if (info != null) {
        return info.aid;
    }
    return -1;
}
// 修改玩家区服
RedisLogic.prototype.setPlayerAid = async function (pid, aid, outTime) {
    return await redisMgr.db_game.set(`pid=${pid}:aid`, aid, outTime);
}
// 删除玩家区服
RedisLogic.prototype.deletePlayerAid = async function (pid) {
    return await redisMgr.db_game.delete(`pid=${pid}:aid`)
}

module.exports = RedisLogic;