var MySqlLogic = function () { }

// 将JS数据处理为SQL语句数据
MySqlLogic.prototype.toSqlData = function (value) {
    if (value == null) {
        return 'NULL'
    }
    else if (typeof (value) == "object") {
        return JSON.stringify(value);
    }
    return `'${value}'`
}
// 将SQL读取到数据处理为Js数据
MySqlLogic.prototype.toJsData = function (value) {
    if (Buffer.isBuffer(value)) {
        return JSON.parse(value.toString("utf8"));
    }
    return value;
}
// 通过idx获取表数据
MySqlLogic.prototype.getTableInfoOfIdx = async function (table, idxFiled, idx, fields) {
    let datas = await this.getTableInfosOfIdx(table, idxFiled, idx, fields);
    if (datas.length > 0) {
        return datas[0];
    }
    return null;
}
// 通过idx获取表数据列表
MySqlLogic.prototype.getTableInfosOfIdx = async function (table, idxFiled, idx, fields) {
    let sql = `SELECT ${fields == null ? '*' : fields.toString()} FROM ${table} WHERE ${idxFiled}=?`
    let rows = await mysqlMgr.db_game.query(sql, [idx]);
    let datas = [];
    for (let index = 0; index < rows.length; index++) {
        // 数据特殊处理
        let data = {};
        for (const key in rows[index]) {
            const value = rows[index][key];
            data[key] = this.toJsData(value);
        }
        datas.push(data);
    }
    return datas;
}
// 通过idx修改表数据
MySqlLogic.prototype.setTableInfoOfIdx = async function (table, idxFiled, idx, valueMap, fields) {
    let arr = [];
    fields = fields ?? Object.keys(valueMap);
    fields.forEach(field => {
        let value = valueMap[field];
        arr.push(`${field}=${this.toSqlData(value)}`);
    });
    let sql = `UPDATE ${table} SET ${arr.toString()} WHERE ${idxFiled}=?`
    let row = await mysqlMgr.db_game.query(sql, [idx]);
    if (row.affectedRows > 0) {
        return true;
    }
    return false;
}

// 获取所有服务器配置信息
MySqlLogic.prototype.getAllServerConfigs = async function () {
    let rows = await mysqlMgr.db_game.query("SELECT * FROM config_server");
    return rows;
}
// 用户注册
MySqlLogic.prototype.register = async function (username, password) {
    let rows = await mysqlMgr.db_game.call('CALL create_user(?,?,?)', [string.uuid(), username, string.md5(password)]);
    if (rows.length > 0) {
        return rows[0];
    }
    return { error: 'DB_ERROR' };
}
// 用户登录
MySqlLogic.prototype.login = async function (username, password) {
    let rows = await mysqlMgr.db_game.call('CALL login_user(?,?)', [username, string.md5(password)]);
    if (rows.length > 0) {
        return rows[0];
    }
    return { error: 'DB_ERROR' };
}
// 更新最后登录区服
MySqlLogic.prototype.updateLastAid = async function (uid, aid) {
    return this.setTableInfoOfIdx("user_info", "uid", uid, { lastAid: aid });
}
// 获取区服信息
MySqlLogic.prototype.getAreaInfo = async function (aid) {
    let rows = await mysqlMgr.db_game.query('SELECT * FROM area_info WHERE aid = ?', [aid]);
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
}
// 获取所有有效区服信息列表（包括维护）
MySqlLogic.prototype.getValidAreaInfos = async function () {
    let rows = await mysqlMgr.db_game.query('SELECT * FROM area_info WHERE state != ?', [GAME_CONST.AREA_STATE.INVALID]);
    return rows;
}
// 获取人物信息
MySqlLogic.prototype.getPlayerInfo = async function (pid) {
    let rows = await mysqlMgr.db_game.query('SELECT * FROM player_info WHERE pid = ?', [pid]);
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
}
// 获取所有有效人物信息列表
MySqlLogic.prototype.getValidPlayerInfos = async function (uid, aid) {
    let rows = await mysqlMgr.db_game.query('SELECT * FROM player_info WHERE uid = ? AND aid = ? AND state != ?', [uid, aid, GAME_CONST.PLAYER_STATE.DELETE]);
    return rows;
}
module.exports = MySqlLogic;