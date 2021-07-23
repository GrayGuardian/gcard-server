var MySqlLogic = function () { }

// 获取所有服务器配置信息
MySqlLogic.prototype.getAllServerConfigs = async function () {
    let rows = await mysqlMgr.db_game.queryAsync("SELECT * FROM config_server");
    return rows;
}

module.exports = MySqlLogic;