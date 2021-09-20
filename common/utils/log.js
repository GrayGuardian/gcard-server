var Log = {};

const STACK_CNT = 3

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


Log.print = function (...args) {
    let arr = [];
    arr.push({ color: "90", text: `[${getDateInfo()}]` });
    arr.push({ color: "37", text: "[Print]" });
    for (let index = 0; index < STACK_CNT; index++) {
        arr.push({ color: "35", text: `[${getStackInfo(index)}]` });
    }
    args.forEach(arg => {
        arr.push({ color: "37", text: arg });
    });
    arr.push({ color: "37", text: '' });

    let logTextArr = []
    arr.forEach(info => {
        logTextArr.push(`\x1B[${typeof (info.text) == 'string' ? info.color : "37"}m`)
        logTextArr.push(info.text);
    });
    console.log(...logTextArr);
}
Log.error = function (...args) {
    let arr = [];
    arr.push({ color: "90", text: `[${getDateInfo()}]` });
    arr.push({ color: "31", text: "[Error]" });
    for (let index = 0; index < STACK_CNT; index++) {
        arr.push({ color: "35", text: `[${getStackInfo(index)}]` });
    }
    args.forEach(arg => {
        arr.push({ color: "31", text: arg });
    });
    arr.push({ color: "37", text: '' });


    let logTextArr = []
    arr.forEach(info => {
        logTextArr.push(`\x1B[${typeof (info.text) == 'string' ? info.color : "37"}m`)
        logTextArr.push(info.text);
    });
    console.log(...logTextArr);
}
module.exports = Log