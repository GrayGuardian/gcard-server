var MySql = require('./mysql');
const Config = require("./config.json");
var MySqlMgr = function () {
    for (const name in Config) {
        let config = Config[name];
        this[name] = new MySql(config);
    }
}

module.exports = MySqlMgr;