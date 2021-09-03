var Router = function () { }

Router.prototype.socketRpc = async function (ctx, next) {
    var middleware = new Middleware()
    middleware.use(async (tctx, tnext) => {
        tctx.state = {};
        tctx.method = {};
        tctx.state.s2sdata = ctx.state.data
        tctx.state.dataPack = tctx.state.s2sdata.data;
        tctx.state.pid = tctx.state.s2sdata.pid;
        tctx.state.aid = tctx.state.s2sdata.aid;
        tctx.method.send = async (router, data) => {
            let dataPack = {};
            dataPack.router = router;
            dataPack[router] = data || {};
            ctx.method.callback({ data: dataPack });
            await next();
        }

        await tnext();
    })

    middleware.use(require('../filter/method'));
    middleware.use(require('../filter/data'));
    middleware.use(require('../filter/router'));

    await middleware.next();
}

// 玩家进入触发 顶号不触发 用于处理数据
Router.prototype.playerEnter = async function (ctx, next) {
    let player = ctx.state.data.player
    log.print(`玩家进入 >> ${player.pid}`)

    // 上线数据处理逻辑
    await lock.SET_MODEL_PLAYER().use(async (lock) => {
        // 获取玩家Model
        let model = await serverLogic.getPlayerModel(player.pid, player)
        // 由于大部分情况都是通过aid分配服务器的，所以此处将aid存储在redis上，所有节点均可直接访问
        await redisLogic.setPlayerAid(model.get_pid(), model.get_aid());

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

    log.print(`玩家离开 >> ${pid}`)


    await lock.SET_MODEL_PLAYER().use(async (lock) => {
        let model = await serverLogic.getPlayerModel(pid)
        // 清理数据 （此处暂时不清理数据，建议以定期清理的方式清理离线过久的玩家缓存）
        // 清理玩家Model
        // modelMgr.deleteModel(GAME_CONST.MODEL_TYPE.PLAYER, pid);
        // 清理redis相关信息
        // await redisLogic.deletePlayerAid(pid);

        // 离线数据处理逻辑
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