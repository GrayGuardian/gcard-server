const Base = require('./base');

Base.inherits(this, Player, Base);

Player.create = async function (pid, data) {
    let model = new Player();
    await model.init(pid, pid, data);
    return model;
}

function Player() {
    this.clsName = 'Player'
    this.net_idxField = 'pid'
    this.db_table = 'player_info';
    this.db_idxField = 'pid';
    this.db_fields = ["pid", 'uid', 'aid', 'name', 'lv', 'exp', "createTime", "loginTime", "logoutTime", "deleteTime", "online", "state"];

    this.TAB = [
        { name: "currency", cls: Model.PlayerCurrency, isArray: false },
        { name: "props", cls: Model.PlayerProps, isArray: true },
    ]

}
Player.prototype.ctor = async function () {
    await this.loadChildModel();
}
Player.prototype.loadData = async function () {
    await this.loadChildModel();
}
// 加载ChildModel
Player.prototype.loadChildModel = async function () {
    for (let index = 0; index < this.TAB.length; index++) {
        const config = this.TAB[index];
        if (config.isArray) {
            // 数组数据处理
            let map = this[`${config.name}Map`]
            if (map == null) {
                map = {};
                let model = new config.cls();
                let infos = await mysqlLogic.getTableInfosOfIdx(model.db_table, this.db_idxField, this.idx, model.db_fields)
                for (let index = 0; index < infos.length; index++) {
                    const info = infos[index];
                    const idx = info[model.db_idxField]
                    map[idx] = await config.cls.create(this.idx, idx, info);
                }
                this[`${config.name}Map`] = map;
            }
            else {
                for (var idx in map) {
                    const model = map[idx];
                    await model.refresh();
                    await model.loadData();
                }
            }
        }
        else {
            // 非数组数据处理
            let model = this[config.name]
            if (model == null) {
                this[config.name] = await config.cls.create(this.idx)
            }
            else {
                await model.refresh();
                await model.loadData();
            }
        }
    }
}


module.exports = Player