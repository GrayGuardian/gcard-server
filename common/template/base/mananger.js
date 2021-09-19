function Base() { }
Base.inherits = function (self, cls, superCls) {
    Base.call(self);
    cls.super_ = superCls;
    Object.setPrototypeOf(cls.prototype, superCls.prototype);
    for (var key in Base) {
        if (Base[key] != null) {
            cls[key] = Base[key];
        }
    }
}

Base.prototype.init = function () {
    this.Model = require(`../model/template_${this.name}Model`)
    this.Data = require(`../data/template_${this.name}`)
    this.tplModelMap = new Map();
    // this.refresh();
}

// 更新数据
Base.prototype.refresh = function () {
    this.baseInfo = {};
    this.Data.data.forEach(data => {
        let field = data[this.field]
        let keyTable = {}
        keyTable[this.field] = field;
        let tplModel = this.getTplModel(keyTable);
        this.baseInfo[field] = tplModel
        this[field] = tplModel
    });
}

Base.prototype.getTplInfo = function (keyTable) {
    let datas = this.Data.data
    for (let index = 0; index < datas.length; index++) {
        const data = datas[index];
        let flag = true
        for (const key in keyTable) {
            const value = keyTable[key];
            if (data[key] != value) {
                flag = false;
                break;
            }
        }
        if (flag) {
            return data;
        }
    }
    return null;
}
Base.prototype.getTplModel = function (keyTable) {
    if (this.tplModelMap.has(keyTable)) {
        console.log("缓存中查询")
        return this.tplModelMap.get(keyTable);
    }
    return this.createTplModel(this.getTplInfo(keyTable));
}
Base.prototype.createTplModel = function (data) {
    return this.Model.create(data);
}


module.exports = Base;