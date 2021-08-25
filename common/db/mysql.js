var MySql = require("mysql");

var MySQL = function (config) {
    this.client = MySql.createConnection(config);
    this.client.connect();
}
MySQL.prototype.query = function (sql, param) {
    return new Promise((resolve) => {
        this.client.query(sql, param, function (error, rows, fields) {
            if (error) throw error;
            resolve(rows);
        });
    });
}

MySQL.prototype.call = function (sql, param) {
    return new Promise((resolve) => {
        this.client.query(sql, param, function (error, rows, fields) {
            if (error) throw error;
            let result;
            if (rows.length > 0) {
                result = rows[0];
            }
            else {
                result = [];
            }
            resolve(result);
        });
    });
}


module.exports = MySQL;