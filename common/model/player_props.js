const Base = require('./base');

Base.inherits(this, PlayerProps, Base);

PlayerProps.create = async function (pid, propsId, data) {
    let model = new PlayerProps();
    await model.init(pid, propsId, data);
    return model;
}

function PlayerProps() {
    this.clsName = 'PlayerProps'
    this.net_idxField = 'pid'
    this.db_table = 'player_props';
    this.db_idxField = 'propsId';
    this.db_fields = ["propsId", 'pid', 'propsId', 'cnt', 'createTime', 'useTime', 'state'];
}

PlayerProps.prototype.ctor = function () {
    this.tpl = Template.template_props[this.idx];
}
module.exports = PlayerProps