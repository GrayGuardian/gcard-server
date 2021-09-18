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
    this.refresh();
}
// 更新数据
Base.prototype.refresh = function () {

}

module.exports = Base;