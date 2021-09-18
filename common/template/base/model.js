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
    this.refresh(data);
}
// 更新数据
Base.prototype.refresh = function (data) {

}
module.exports = Base;