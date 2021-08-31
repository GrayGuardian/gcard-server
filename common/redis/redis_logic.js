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
module.exports = RedisLogic;