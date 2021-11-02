var redis = require("redis");

var Redis = function (config) {
    this.client = redis.createClient(config);

    //redis key过期回调
    let client = redis.createClient(config);
    client.send_command('config', ['set', 'notify-keyspace-events', 'AKE'], (err, res) => {
        if (err) {
            return
        }
        client.subscribe('__keyevent@0__:set', () => {
            client.on('message', function (chan, key) {
                if (chan == '__keyevent@0__:set') {
                    //判断key做出相应的处理。
                    log.print(`[Redis] 数据被修改 >>> ${key}`)
                    eventManager.dispatch(EVENT_CODE.REDIS_KEY_SET(key));
                }
            });
        })
        client.subscribe('__keyevent@0__:del', () => {
            client.on('message', function (chan, key) {
                if (chan == '__keyevent@0__:del') {
                    //判断key做出相应的处理。
                    log.print(`[Redis] 数据被删除 >>> ${key}`)
                    eventManager.dispatch(EVENT_CODE.REDIS_KEY_DELETE(key));
                }
            });
        })
        client.subscribe('__keyevent@0__:expired', () => {
            client.on('message', function (chan, key) {
                if (chan == '__keyevent@0__:expired') {
                    //判断key做出相应的处理。
                    log.print(`[Redis] 数据过期清理 >>> ${key}`)
                    eventManager.dispatch(EVENT_CODE.REDIS_KEY_OUT(key));
                }
            });
        })
    })



}
Redis.prototype.setnx = function (key, value, outTime) {
    return new Promise((resolve) => {
        this.client.setnx(key, JSON.stringify(value), (error, result) => {
            if (error) throw error;
            if (result > 0 && outTime > 0) {
                this.expire(key, outTime).then((flag) => {
                    resolve(flag);
                });
            }
            else {
                resolve(result > 0);
            }
        });
    });
}

Redis.prototype.set = function (key, value, outTime) {
    return new Promise((resolve) => {
        this.client.set(key, JSON.stringify(value), (error, result) => {
            if (error) throw error;
            if (outTime > 0) {
                this.expire(key, outTime).then((flag) => { resolve(flag); });
            }
            else {
                resolve(result == "OK");
            }

        });
    });
}
Redis.prototype.delete = function (key) {
    return new Promise((resolve) => {
        this.client.del(key, (error, result) => {
            if (error) throw error;
            resolve(result > 0);
        });
    });
}

Redis.prototype.get = function (key) {
    return new Promise((resolve) => {
        this.client.get(key, (error, result) => {
            if (error) throw error;
            resolve(JSON.parse(result));
        });
    });
}

Redis.prototype.expire = function (key, outTime) {
    return new Promise((resolve) => {
        this.client.expire(key, outTime, (error, result) => {
            if (error) throw error;
            resolve(result > 0);
        })
    });
}

Redis.prototype.exist = async function (key) {
    return ((await this.get(key)) != null);
}

module.exports = Redis;