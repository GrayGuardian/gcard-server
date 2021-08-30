var Redis = require('./redis');
const Config = require("./config.json");
var RedisMgr = function () {
    for (const name in Config) {
        let config = Config[name];
        this[name] = new Redis(config);
    }
}

module.exports = RedisMgr;