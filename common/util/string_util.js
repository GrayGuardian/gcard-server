global.string = {}
string.toJson = function (object, name) {
    var result = "";
    function serializeInternal(o, path) {
        for (p in o) {
            var value = o[p];
            if (value == null) {
                result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "null;";
            }
            else {
                if (typeof value != "object") {
                    if (typeof value == "string") {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "] = " + "\"" + value.replace(/\"/g, "\\\"") + "\"" + ";";
                    } else {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "] = " + value + ";";
                    }
                }
                else {
                    if (value instanceof Array) {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "new Array();";
                        serializeInternal(value, path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]");
                    } else {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "new Object();";
                        serializeInternal(value, path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]");
                    }
                }
            }
        }
    }
    serializeInternal(object, name);
    return result;
}
string.formatTable = function (formatText, t) {
    let result = formatText
    if (t == null) {
        return result
    }
    Object.keys(t).forEach(function (key) {
        result = result.replace(`{${key}}`, t[key])
    })
    return result
}
const MD5 = require('md5-node')
string.md5 = function (content) {
    content = typeof (content) == 'string' ? content : JSON.stringify(content);
    return MD5(content);
}

const UUID = require('uuid');
string.uuid = function () {
    return UUID.v1();
}
