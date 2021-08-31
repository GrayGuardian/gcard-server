const UNLOCK_TIME = 10;         //自动解锁默认时长 单位：s
var Lock = function (key, outTime) {
    this.key = key;
    this.outTime = outTime || UNLOCK_TIME;
    this.isLock = false;
    this.isTrigger = false;
    this.lockTime = null;

    this.onLockOut = () => {
        if (!this.isLock && !this.isTrigger) {
            // 尝试调用
            this.tryCall()
        }
    }
    this.onLockDelete = () => {
        if (!this.isLock && !this.isTrigger) {
            // 尝试调用
            this.tryCall()
        }
    }
    broadcast.on(BROADCAST_CODE.REDIS_KEY_OUT(`lock:${this.key}`), this.onLockOut);
    broadcast.on(BROADCAST_CODE.REDIS_KEY_DELETE(`lock:${this.key}`), this.onLockDelete);
}
// 注册
Lock.prototype.use = function (cb) {
    this.cb = cb;
    // 尝试调用
    this.tryCall()
}

// 尝试调用
Lock.prototype.tryCall = async function () {
    let isLock = await redisLogic.existLock(this.key);
    if (isLock) {
        // 锁存在则返回
        return false;
    }
    // 先上锁
    isLock = await redisLogic.lock(this.key, this.outTime)
    if (!isLock) {
        // 上锁不成功则返回
        return false;
    }

    // 上锁成功操作
    this.isLock = true;
    this.isTrigger = true;
    this.lockTime = Date.unix();

    if (this.cb != null) {
        this.cb(this);
    }
    return true;
}

Lock.prototype.unlock = async function () {
    await redisLogic.unlock(this.key);
    this.close();
}
Lock.prototype.close = function () {
    this.isLock = false;
    this.lockTime = null;
    broadcast.out(BROADCAST_CODE.REDIS_KEY_OUT(`lock:${this.key}`), this.onLockOut);
    broadcast.out(BROADCAST_CODE.REDIS_KEY_DELETE(`lock:${this.key}`), this.onLockDelete);
}
// 锁续期
Lock.prototype.extended = async function (time) {
    if (!this.isLock) return false;
    let now = Date.unix();
    let outTime = this.lockTime + this.outTime
    let offset = outTime - now;
    if (offset < 0) return false;
    return await redisLogic.extendedLock(this.key, offset + time);
}


module.exports = Lock;