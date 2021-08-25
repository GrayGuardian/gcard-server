var MySqlLogic = function () { }

// 获取所有服务器配置信息
MySqlLogic.prototype.getAllServerConfigs = async function () {
    let rows = await mysqlMgr.db_game.query("SELECT * FROM config_server");
    return rows;
}
MySqlLogic.prototype.register = async function (username, password) {
    let rows = await mysqlMgr.db_game.call('CALL create_user(?,?,?,?)', [util.uuid(), username, util.md5(password), Date.unix()]);
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
}
MySqlLogic.prototype.login = async function (username, password) {
    let rows = await mysqlMgr.db_game.query('SELECT * FROM user_info WHERE username = ? AND password = ?', [username, util.md5(password)]);
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
}
module.exports = MySqlLogic;