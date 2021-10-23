// 该文件通过工具生成，只可以修改可编辑区块中的内容

const Base = require('../base/model');

Base.inherits(this, Model, Base);

Model.create = function (data) {
    let model = new Model();
    model.init(data);
    return model;
}

function Model() {
    this.name = 'error'
}

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 可编辑区块 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// 获得错误文本
Model.prototype.getTip = function (data) {
    let text = this.get_tip().get_text()
    return string.formatTable(text, data)
}

Model.prototype.getDataPack = function (data) {
    let dataPack = {}
    dataPack.id = this.get_id()
    if (data != null) {
        dataPack.data = {}
        dataPack.data[this.get_id()] = data
    }
    return dataPack
}

Model.prototype.equal = function (error) {
    try {
        return this.get_id() == error.get_id()
    }
    catch {
        return false
    }
}

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 可编辑区块 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

module.exports = Model