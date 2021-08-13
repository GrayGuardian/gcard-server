var Log = {};

let getStackInfo = function () {
    function getException() {
        try {
            throw Error('');
        } catch (ex) {
            return ex;
        }
    }

    let ex = getException();
    let stack = ex.stack;
    let stackArr = stack.split('\n');
    let index = -1;
    for (let i = 0; i < stackArr.length; i++) {
        if (stackArr[i].indexOf('getStackInfo') != -1 && i + 2 < stackArr.length) {
            index = i + 2;
        }
    }
    if (index == -1) {
        return ' - ';
    }
    let stackStr = stackArr[index];

    return stackStr.substring(stackStr.lastIndexOf('\\') + 1, stackStr.lastIndexOf(':'));
}
let getDateInfo = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
}


Log.print = function (text) {
    let arr = [
        { color: "90", text: `[${getDateInfo()}]` },
        { color: "37", text: "[Print]" },
        { color: "35", text: `[${getStackInfo()}]` },
        { color: "37", text: text },
    ]
    let logText = '';
    arr.forEach(info => {
        logText += `\x1B[${info.color}m${info.text} `
    });
    console.log(logText);
}
Log.error = function (text) {
    let arr = [
        { color: "90", text: `[${getDateInfo()}]` },
        { color: "31", text: "[Error]" },
        { color: "35", text: `[${getStackInfo()}]` },
        { color: "31", text: text },
    ]
    let logText = '';
    arr.forEach(info => {
        logText += `\x1B[${info.color}m${info.text} `
    });
    console.log(logText);
}
module.exports = Log