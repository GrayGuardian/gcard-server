var MySqlLogic = function () { }

// 获取所有服务器配置信息
MySqlLogic.prototype.getAllServerConfigs = async function () {
    let rows = await mysqlMgr.db_game.query("SELECT * FROM config_server");
    return rows;
}
// 用户注册
MySqlLogic.prototype.register = async function (username, password) {
    let rows = await mysqlMgr.db_game.call('CALL create_user(?,?,?)', [util.uuid(), username, util.md5(password)]);
    if (rows.length > 0) {
        return rows[0];
    }
    return { error: 'DB_ERROR' };
}
// 用户登录
MySqlLogic.prototype.login = async function (username, password) {
    let rows = await mysqlMgr.db_game.call('CALL login_user(?,?)', [username, util.md5(password)]);
    if (rows.length > 0) {
        return rows[0];
    }
    return { error: 'DB_ERROR' };
}
// 更新最后登录区服
MySqlLogic.prototype.updateLastAid = async function (uid, aid) {
    let rows = await mysqlMgr.db_game.query('UPDATE user_info SET lastAid=? WHERE uid=?', [aid, uid]);
    if (rows.length > 0) {
        return true;
    }
    return false;
}
// 获取所有有效区服信息列表（包括维护）
MySqlLogic.prototype.getValidAreaInfos = async function () {
    let rows = await mysqlMgr.db_game.query('SELECT * FROM area_info WHERE state != ?', [GAME_CONST.AREA_STATE.INVALID]);
    return rows;
}
// 获取所有有效人物信息列表
MySqlLogic.prototype.getValidAreaInfos = async function () {
    let rows = await mysqlMgr.db_game.query('SELECT * FROM area_info WHERE state != ?', [GAME_CONST.AREA_STATE.INVALID]);
    return rows;
}
module.exports = MySqlLogic;