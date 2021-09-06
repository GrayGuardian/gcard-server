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
Base.jsonParse = async function (str) {
    eval(str);
    await this.refresh();
    await this.loadData();
    return this;
}

Base.prototype.toJson = function () {
    return util.toJson(this, 'this');
}
// ----------------- 子类重写 -----------------
// 初始化函数
Base.prototype.ctor = async function () {

}
// 跨进程传递后会造成的引用地址丢失 该函数用于扩展重新初始化动态函数等需要变量引用地址的代码
Base.prototype.loadData = async function () {

}
// ----------------- 子类重写 -----------------

Base.prototype.init = async function (net_idx, db_idx, data) {
    this.net_idx = net_idx;
    this.db_idx = db_idx;
    this.idx = this.db_idx;

    await this.refresh(data);
    await this.ctor();
    await this.loadData();
}
// 从数据库更新到缓存数据
Base.prototype.updateDBToData = async function () {
    let row = await mysqlLogic.getTableInfoOfIdx(this.db_table, this.db_idxField, this.db_idx, this.db_fields)
    if (row == null) {
        log.error(`[Model] 数据不存在 Form:${this.clsName} db_table:${this.db_table} db_idxField:${this.db_idxField} db_idx:${this.db_idx}`);
        return;
    }
    this.refresh(row);
}
// 从缓存数据更新到数据库
Base.prototype.updateDataToDB = async function () {
    let flag = await mysqlLogic.setTableInfoOfIdx(this.db_table, this.db_idxField, this.db_idx, this.baseInfo, this.db_fields);
    if (!flag) {
        log.error(`[Model] 更新数据库失败 Form:${this.clsName} db_idxField:${this.db_idxField} db_idx:${this.db_idx}`);
    }
    return flag;
}
//更新数据到客户端
Base.prototype.updateClientData = async function () {
    let dataPack = {}
    dataPack.clsName = this.clsName;
    dataPack.idx = this.idx;
    dataPack[this.clsName] = this.baseInfo;

    log.print(`[Model] 更新数据到客户端 Form:${this.clsName} idx:${this.idx} data:${JSON.stringify(this.baseInfo)}`);

    // log.print(`向Channel[${`${this.db_idxField}=${this.idx}`}]发送数据>>>${JSON.stringify(dataPack)}`)
    await s2sLogic.sendToID(this.net_idx, 'updateModelData', dataPack)
}
// 更新数据
Base.prototype.refresh = async function (data) {
    if (this.baseInfo == null && data == null) {
        await this.updateDBToData();
        return;
    }
    if (data != null) {
        // 这里注意要重建一个对象，防止数据有很多隐藏字段
        data = JSON.parse(JSON.stringify(data));
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