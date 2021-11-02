var EventManager = function () {
    this.callBackInfoMap = {}
}
EventManager.prototype.dispatch = function (key, data) {
    let index = 0;
    if (this.exist(key) == false) {
        return index;
    }
    let removeList = []
    for (var i in this.callBackInfoMap[key]) {
        var v = this.callBackInfoMap[key][i];
        v.callback(data);
        index++;
        if (v.isOnce) {
            removeList.push(v.callback);
        }
    }
    //将使用一次即删除的卸载
    for (var i in removeList) {
        var v = removeList[i];
        this.out(key, v)
    }
    return index;
}
EventManager.prototype.on = function (key, callback, order, isOnce) {
    let info = {};
    info.callback = callback;
    info.order = order || 0
    info.isOnce = isOnce || false

    let list = [];
    if (this.exist(key) == false) {
        // 键值不存在则新建
        list.push(info);
        this.callBackInfoMap[key] = list;
    } else if (this.exist(key, callback)) {
        // 重复则不注册
        return false;
    } else {
        list = this.callBackInfoMap[key];
        let index = null;
        for (var i in list) {
            var o = list[i];
            if (o.order > info.order) {
                index = i
                break;
            }
        }
        index = index || list.length
        list.splice(index, 0, info);
    }
    return true;
}
EventManager.prototype.out = function (key, callback) {
    if (this.exist(key, callback) == false) {
        return false;
    }
    let list = this.callBackInfoMap[key];
    for (var i in list) {
        var v = list[i];
        if (v.callback == callback) {
            list.splice(i, 1);
            return true;
        }
    }
    return false;
}
EventManager.prototype.clear = function (key) {
    if (this.exist(key) == true) {
        this.callBackInfoMap[key] = null;
        return true
    }
    return false;
}
EventManager.prototype.exist = function (key, callback) {
    if (this.callBackInfoMap[key] != null) {
        if (callback == null) {
            return true;
        } else {
            let list = this.callBackInfoMap[key];
            for (var i in list) {
                var v = list[i];
                if (v.callback == callback) {
                    return true;
                }
            }
            return false;
        }
    }
    return false;
}
module.exports = EventManager;