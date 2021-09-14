
// 该文件通过工具生成，只可以修改可编辑区块中的内容

const Base = require('./base');

Base.inherits(this, Model, Base);

Model.create = function (data) {
    let model = new Model();
    model.init(data);
    return model;
}

function Model() {
    this.tplName = 'test'
}

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 可编辑区块 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 可编辑区块 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

module.exports = Model
	