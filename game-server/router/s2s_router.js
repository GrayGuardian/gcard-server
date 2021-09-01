var Router = function () { }

Router.prototype.test = async function (ctx, next) {
    console.log("test logic event")
    ctx.method.callback();
    await next();
}

// 玩家进入触发 顶号不触发 用于处理数据
Router.prototype.playerEnter = async function (ctx, next) {
    let player = ctx.state.data.player
    log.print(`玩家进入 >> ${player.pid}`)
    // 初始数据
    // 获取玩家Model，获取不到则新建
    let model = await serverLogic.getPlayerModel(player.pid, player)
    // 由于大部分情况都是通过aid分配服务器的，所以此处将aid存储在redis上，所有节点均可直接访问
    await redisLogic.setPlayerAid(model.get_pid(), model.get_aid());
    // 上线数据处理逻辑
    await lock.SET_MODEL_PLAYER().use(function (lock) {
        model.set_loginTime(Date.unix())
        model.set_online(1);
        await model.updateDataToDB();

        lock.success()
    })

    ctx.method.callback();
    await next();
}
// 玩家退出触发 顶号不触发 用于处理数据
Router.prototype.playerLeave = async function (ctx, next) {
    let pid = ctx.state.data.pid;
    let model = await serverLogic.getPlayerModel(pid)
    log.print(`玩家离开 >> ${pid}`)
    // 清理数据 （此处暂时不清理数据，建议以定期清理的方式清理离线过久的玩家缓存）
    // 清理玩家Model
    // modelMgr.deleteModel(GAME_CONST.MODEL_TYPE.PLAYER, pid);
    // 清理redis相关信息
    // await redisLogic.deletePlayerAid(pid);

    // 离线数据处理逻辑
    await lock.SET_MODEL_PLAYER().use(function (lock) {
        model.set_logoutTime(Date.unix())
        model.set_online(0);
        await model.updateDataToDB();

        lock.success()
    })

    ctx.method.callback();
    await next();
}

Router.prototype.getPlayerModel = async function (ctx, next) {
    let pid = ctx.state.data.pid;
    let data = ctx.state.data.data;
    let model = await serverLogic.getPlayerModel(pid, data);

    ctx.method.callback({ jsonBuff: Buffer.from(model.toJson()) })
    await next();
}
module.exports = Router;