var MySql = require("mysql");

var MySQL = function (config) {
    this.client = MySql.createConnection(config);
    this.client.connect();
}
MySQL.prototype.queryAsync = function (sql, param) {
    return new Promise((resolve) => {
        this.client.query(sql, param, function (error, rows, fields) {
            if (error) throw error;
            resolve(rows);
        });
    });
}
MySQL.prototype.query = function (sql, param, cb) {
    this.client.query(sql, param, function (error, rows, fields) {
        if (error) throw error;
        if (cb != null) cb(rows);
    });
}
MySQL.prototype.callAsync = function (sql, param) {
    return new Promise((resolve) => {
        this.call(sql, param, function (result) {
            resolve(result);
        });
    });
}
MySQL.prototype.call = function (sql, param, cb) {
    this.client.query(sql, param, function (error, rows, fields) {
        if (error) throw error;
        let result;
        if (rows.length > 0) {
            result = rows[0];
        }
        else {
            result = [];
        }
        if (cb != null) cb(result);
    });
}

module.exports = MySQL;