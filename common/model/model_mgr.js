var ModelMgr = function () {
    this.modelMap = {};
}
ModelMgr.prototype.pushModel = function (type, idx, model) {
    this.modelMap[type] = this.modelMap[type] || {};
    this.modelMap[type][idx] = model;
}
ModelMgr.prototype.deleteModel = function (type, idx) {
    try {
        delete this.modelMap[type][idx];
        return true;
    } catch {
        return false;
    }
}
ModelMgr.prototype.getModel = function (type, idx) {
    try {
        return this.modelMap[type][idx];
    } catch {
        return null;
    }
}


module.exports = ModelMgr;