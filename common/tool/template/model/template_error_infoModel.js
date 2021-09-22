// 该文件通过工具生成，只可以修改可编辑区块中的内容

const Base = require('../base/model');

Base.inherits(this, Model, Base);

Model.create = function (data) {
    let model = new Model();
    model.init(data);
    return model;
}

function Model() {
    this.name = 'error_info'
}

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 可编辑区块 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

Model.prototype.getClientErrorPackage = function (data) {
    let infoPackage = {}
    infoPackage.code = this.get_code()
    infoPackage.tip = this.get_clientTip();
    let dataPackage = {}
    dataPackage[this.get_code()] = data;
    return { info: infoPackage, data: dataPackage };
}
Model.prototype.getServerErrorPackage = function (data) {
    let infoPackage = {}
    infoPackage.code = this.get_code()
    infoPackage.tip = this.get_serverTip();
    let dataPackage = {}
    dataPackage[this.get_code()] = data;
    return { info: infoPackage, data: dataPackage };
}
Model.prototype.equal = function (tplModel) {
    return this.get_code() == tplModel.get_code();
}

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 可编辑区块 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

module.exports = Model