var ServerLogic = function () { }



// 获取玩家Model
ServerLogic.prototype.getPlayerModel = async function (pid, data) {
    let model = modelMgr.getModel(GAME_CONST.MODEL_TYPE.PLAYER, pid)
    if (model != null) {
        return model;
    }
    data = data || await mysqlLogic.getPlayerInfo(pid);
    model = await Model.Player.create(pid, data)
    modelMgr.pushModel(model.clsName, pid, model);
    return model
}



module.exports = ServerLogic;