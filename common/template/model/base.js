function Base() {

}
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
    this.refresh(data);
}

// 更新数据
Base.prototype.refresh = function (data) {
    if (data != null) {
        // 这里注意要重建一个对象，防止数据有很多隐藏字段
        this.baseInfo = {}
        this.db_fields.forEach(field => {
            this.baseInfo[field] = data[field]
        });
    }
    for (const key in this.baseInfo) {
        this[`get_${key}`] = () => {
            return this.baseInfo[key];
        };
        this[`set_${key}`] = (value) => {
            this.baseInfo[key] = value;
        };
    }
}
module.exports = Base;