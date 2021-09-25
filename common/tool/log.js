var Log = {};

const STACK_CNT = 3

const COLOR = {
    WHITE: "37",
    GRAY: "90",
    RED: "31",
    PURPLE: "35",
    YELLOW: "33",
}

let getStackInfo = function (offset) {
    offset = offset || 0;
    function getException() {
        try {
            throw Error('');
        } catch (ex) {
            return ex;
        }
    }
    let START = 3   // 初始底层堆栈数量
    let ex = getException();
    let stack = ex.stack;
    let stackArr = stack.split('\n');
    let index = -1;
    for (let i = 0; i < stackArr.length; i++) {
        if (stackArr[i].indexOf('getStackInfo') != -1 && i + START + offset < stackArr.length) {
            index = i + START + offset;
        }
    }
    if (index == -1) {
        return ' - ';
    }
    let stackStr = stackArr[index];
    let str = stackStr.substring(stackStr.lastIndexOf('\\') + 1, stackStr.lastIndexOf(':'))
    str = str.substring(str.lastIndexOf('/') + 1, str.lastIndexOf(':'))
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
let getTopText = function (tag, color) {
    let arr = [];
    // 时间
    arr.push({ color: COLOR.GRAY, text: `[${getDateInfo()}]` });
    // 标签
    arr.push({ color: color, text: `[${tag}]` });
    // 堆栈信息
    for (let index = 0; index < STACK_CNT; index++) {
        arr.push({ color: COLOR.PURPLE, text: `[${getStackInfo(index)}]` });
    }
    let str = ''
    arr.forEach(info => {
        str += `\x1B[${info.color}m${info.text} `
    });
    str.slice(0, str.Length - 1)
    return str
}

Log.print = function (...args) {
    let arr = []
    args.forEach(arg => {
        arr.push(`\x1B[${COLOR.WHITE}m`)
        arr.push(arg);
    });
    arr.push(`\x1B[${COLOR.WHITE}m`)
    console.log(getTopText('Print', COLOR.WHITE), ...arr);
}
Log.error = function (...args) {
    let arr = []
    args.forEach(arg => {
        arr.push(`\x1B[${COLOR.RED}m`)
        arr.push(arg);
    });
    arr.push(`\x1B[${COLOR.WHITE}m`)
    console.log(getTopText('Error', COLOR.RED), ...arr);
}
Log.warn = function (...args) {
    let arr = []
    args.forEach(arg => {
        arr.push(`\x1B[${COLOR.YELLOW}m`)
        arr.push(arg);
    });
    arr.push(`\x1B[${COLOR.WHITE}m`)
    console.log(getTopText('Warn', COLOR.YELLOW), ...arr);
}
module.exports = Log