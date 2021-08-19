var SUCCESS_CODE = 200;
var systemCode = SUCCESS_CODE;
var logicCode = 500;

const genSystemCode = function () {
    systemCode++;
    return systemCode;
}
const genLogicCode = function () {
    logicCode++;
    return logicCode;
}
const ERROR_CODE = {
    SUCCESS: SUCCESS_CODE,
    UNKNOWN_ERROR: genSystemCode(),
}

const ERROR_MSG = {
    [ERROR_CODE.SUCCESS]: '成功',
    [ERROR_CODE.UNKNOWN_ERROR]: '未知错误',
}
const genErrorMsg = function (code) {
    let data = {};
    let msg = ERROR_MSG[code];
    data.code = code;
    data.msg = msg == null ? ERROR_MSG[ERROR_CODE.UNKNOWN_ERROR] : msg;
    return data;
}
module.exports = { SUCCESS_CODE: SUCCESS_CODE, ERROR_CODE: ERROR_CODE, genErrorMsg: genErrorMsg }