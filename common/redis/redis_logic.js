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
RedisLogic.prototype.getPlayerAid = async function (pid, isOnline) {
    isOnline = isOnline == null ? false : isOnline;  //是否只查询在线玩家，不在线需要从Sql数据库查询，此处为减轻数据库压力而细分
    let aid = await redisMgr.db_game.get(`pid=${pid}:aid`)
    if (aid != null) {
        return aid;
    }
    if (!isOnline) {
        let info = await mysqlLogic.getPlayerInfo(pid);
        if (info != null) {
            await this.setPlayerAid(pid, info.aid, 60)   //临时获取设置过期时间
            return info.aid;
        }
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