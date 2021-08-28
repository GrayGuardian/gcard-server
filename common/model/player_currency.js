const Base = require('./base');

Base.inherits(this, PlayerCurrency, Base);

PlayerCurrency.create = async function (pid, data) {
    let model = new PlayerCurrency();
    await model.init(pid, pid, data);
    return model;
}

function PlayerCurrency() {
    this.clsName = 'PlayerCurrency'
    this.net_idxField = 'pid'
    this.db_table = 'player_currency';
    this.db_idxField = 'pid';
    this.db_fields = ["pid", 'currency0', 'currency1'];
}

module.exports = PlayerCurrency