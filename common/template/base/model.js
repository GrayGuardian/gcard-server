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
Base.prototype.init = function (data) {
    this.manager = Template[`template_${this.name}`]
    this.Data = require(`../data/template_${this.name}`)

    this.refresh(data);
}
// 数据处理
Base.prototype.getFieldValue = function (type, value) {
    // 复杂参数处理
    let temp = [];
    temp = type.match(/^table\[(.*?)\]$/)
    if (temp != null) {
        // table处理
        // console.log(value);
        let tarr = temp[1].split('&')
        let data = {}
        tarr.forEach(element => {
            let temp = element.split('=')
            let field = temp[0]
            let type = temp[1]
            if (value[field] != null) {
                data[field] = this.getFieldValue(type, value[field])
            }
        });
        // console.log(data)
        return data;
    }
    temp = type.match(/^array\[(.*?)\]$/)
    if (temp != null) {
        // array处理
        type = temp[1];
        let datas = []
        value.forEach(data => {
            datas.push(this.getFieldValue(type, data));
        });
        return datas;
    }
    temp = type.split('$')
    if (temp.length > 1) {
        let manager = Template[`template_${temp[0]}`]
        let keyTable = {}
        keyTable[temp[1]] = value;
        return manager.getTplModel(keyTable)
    }
    return value;
}
// 更新数据
Base.prototype.refresh = function (data) {
    this.baseInfo = {}
    this.Data.fields.forEach(field => {
        const value = data[field];
        this.baseInfo[field] = this.getFieldValue(this.Data.types[field], value)
    });
    for (const key in this.baseInfo) {
        const value = this.baseInfo[key];
        this[`get_${key}`] = () => {
            return this.baseInfo[key];
        };
    }
}
module.exports = Base;