var MySqlLogic = function () { }

// 获取所有服务器配置信息
MySqlLogic.prototype.getAllServerConfigs = async function () {
    let rows = await mysqlMgr.db_game.query("SELECT * FROM config_server");
    return rows;
}
MySqlLogic.prototype.register = async function (username, password) {

}

module.exports = MySqlLogic;