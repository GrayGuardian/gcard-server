var LockMgr = {}
LockMgr.LOCK_TYPE = {
    MODEL_PLAYER: function (pid) {
        return `MODEL_PLAYER_${pid}`
    }
}
for (const key in LockMgr.LOCK_TYPE) {
    let value = LockMgr.LOCK_TYPE[key];
    LockMgr[key] = (arg1, arg2, arg3, arg4) => {
        if (typeof (value) == 'function') {
            value = value(arg1, arg2, arg3, arg4);
        }
        return new Lock(value);
    }
}

const UNLOCK_TIME = 10;         //自动解锁默认时长 单位：s
var Lock = function (key, outTime) {
    this.key = key;
    this.outTime = outTime || UNLOCK_TIME;
    this.isLock = false;
    this.isTrigger = false;
    this.errorEx = null;
    this.lockTime = null;

    this.successFunc = null;
    this.errorFunc = null;

    this.onLockOut = () => {
        if (!this.isLock && !this.isTrigger) {
            // 尝试调用
            this.tryCall()
        } else if (this.isTrigger) {
            this.error(ERROR_INFO.TIMEOUT)
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
Lock.prototype.use = function (cb, error) {
    // this.cb = cb;
    // // 尝试调用
    // this.tryCall()

    return new Promise((resolve) => {
        this.successFunc = () => {
            resolve(true);
        }
        this.errorFunc = (ex) => {
            if (error != null) error(ex);
            resolve(false);
        }
        this.cb = cb;

        this.tryCall();

    });

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
        try {
            await this.cb(this);
        }
        catch (ex) {
            this.errorEx = ex;
            // throw ex
        }
    }
    return true;
}
Lock.prototype.error = function (ex) {
    this.errorEx = ex || this.errorEx;
    if (this.errorEx != null && this.errorFunc != null) {
        this.errorFunc(this.errorEx);
    }
    this.unlock();
}
Lock.prototype.success = function () {
    if (this.errorEx == null && this.successFunc != null) {
        this.successFunc();
    }
    this.unlock();
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


module.exports = LockMgr