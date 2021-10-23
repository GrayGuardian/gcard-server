// 该文件通过工具生成，只可以修改可编辑区块中的内容

const Base = require('../base/mananger');

Base.inherits(this, Mgr, Base);

Mgr.create = function () {
    let mgr = new Mgr();
    mgr.init();
    return mgr;
}

function Mgr() {
    this.name = 'text'
    this.field = 'id'
}

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 可编辑区块 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 可编辑区块 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

module.exports = Mgr