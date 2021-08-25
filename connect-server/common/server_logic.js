var ServerLogic = function () {

}
// 玩家进入触发 顶号不触发 用于处理数据
ServerLogic.prototype.playerEnter = async function (pid) {
    log.print(`玩家进入 >> ${pid}`)
}
// 玩家退出触发 顶号不触发 用于处理数据
ServerLogic.prototype.playerLeave = async function (pid) {
    log.print(`玩家离开 >> ${pid}`)
}
// 进入游戏、重连、顶号均触发，用于发送状态同步数据包
ServerLogic.prototype.playerConnect = async function (pid) {
    log.print(`发送状态同步数据包 >> ${pid}`);
}
module.exports = ServerLogic;