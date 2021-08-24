var Log = {};

let getStackInfo = function (offset) {
    offset = offset ?? 0;
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
        if (stackArr[i].indexOf('getStackInfo') != -1 && i + 2 + offset < stackArr.length) {
            index = i + 2 + offset;
        }
    }
    if (index == -1) {
        return ' - ';
    }
    let stackStr = stackArr[index];
    let str = stackStr.substring(stackStr.lastIndexOf('\\') + 1, stackStr.lastIndexOf(':'))
    str = str.substring(str.indexOf('(') + 1)

    return str;
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


Log.print = function (text, stackCnt) {
    stackCnt = stackCnt ?? 3;
    let arr = [];
    arr.push({ color: "90", text: `[${getDateInfo()}]` });
    arr.push({ color: "37", text: "[Print]" });
    for (let index = 0; index < stackCnt; index++) {
        arr.push({ color: "35", text: `[${getStackInfo(index)}]` });
    }
    arr.push({ color: "37", text: text });
    arr.push({ color: "37", text: '' });

    let logText = '';
    arr.forEach(info => {
        logText += `\x1B[${info.color}m${info.text} `
    });
    console.log(logText);
}
Log.error = function (text, stackCnt) {
    stackCnt = stackCnt ?? 3;
    let arr = [];
    arr.push({ color: "90", text: `[${getDateInfo()}]` });
    arr.push({ color: "31", text: "[Error]" });
    for (let index = 0; index < stackCnt; index++) {
        arr.push({ color: "35", text: `[${getStackInfo(index)}]` });
    }
    arr.push({ color: "31", text: text });
    arr.push({ color: "37", text: '' });

    let logText = '';
    arr.forEach(info => {
        logText += `\x1B[${info.color}m${info.text} `
    });
    console.log(logText);
}
module.exports = Log