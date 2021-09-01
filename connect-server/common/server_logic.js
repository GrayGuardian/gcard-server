var ServerLogic = function () {

}
// 玩家进入触发 顶号不触发 用于处理数据
ServerLogic.prototype.playerEnter = async function (pid) {
    log.print(`玩家进入 >> ${pid}`)
    // 由于转发需要aid，所以此处直接从mysql读数据，并且直接发送
    let player = await mysqlLogic.getPlayerInfo(pid);
    // 统一转发至game-server处理
    await s2sLogic.playerEnter(player);
}
// 玩家退出触发 顶号不触发 用于处理数据
ServerLogic.prototype.playerLeave = async function (pid) {
    log.print(`玩家离开 >> ${pid}`)
    // 统一转发至game-server处理
    await s2sLogic.playerLeave(pid);
}

module.exports = ServerLogic;