var ServerLogic = function () {

}
// 玩家进入触发 顶号不触发 用于处理数据
ServerLogic.prototype.playerEnter = async function (pid) {
    log.print(`玩家进入 >> ${pid}`)
    let player = await mysqlLogic.getPlayerInfo(pid);
    await s2sLogic.playerEnter(player);
}
// 玩家退出触发 顶号不触发 用于处理数据
ServerLogic.prototype.playerLeave = async function (pid) {
    log.print(`玩家离开 >> ${pid}`)
    await s2sLogic.playerLeave(player);
}

module.exports = ServerLogic;