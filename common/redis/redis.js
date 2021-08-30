var redis = require("redis");

var Redis = function (config) {
    this.client = redis.createClient(config);

    //redis key过期回调
    let client = redis.createClient(config);
    client.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], (err, res) => {
        if (err) {
            return
        }
        client.subscribe('__keyevent@0__:expired', () => {
            client.on('message', function (chan, msg) {
                console.log("chan:" + chan)
                //判断key做出相应的处理。
                console.log("msg:" + msg)
            });
        })
    })


}
Redis.prototype.set = function (key, value, outTime) {
    return new Promise((resolve) => {
        this.client.set(key, JSON.stringify(value), (error, result) => {
            if (error) throw error;
            if (outTime > 0) {
                this.client.expire(key, outTime);
            }
            resolve(result == "OK");
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


module.exports = Redis;