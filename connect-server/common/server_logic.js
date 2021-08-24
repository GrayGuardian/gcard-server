var ServerLogic = function () {

}
ServerLogic.prototype.playerEnter = async function (pid) {
    log.print(`玩家进入 >> ${pid}`)
}
ServerLogic.prototype.playerLeave = async function (pid) {
    log.print(`玩家离开 >> ${pid}`)
}
module.exports = ServerLogic;