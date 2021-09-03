const connectRouter = new (require("../router/connect_router"))()
module.exports = async (ctx, next) => {
    log.print(`[socket] [c2s] >>> [${ctx.state.router}] ${JSON.stringify(ctx.state.data)}`)
    // 本地存在则本地执行
    let fun = connectRouter[ctx.state.router];
    if (fun != null) {
        fun(ctx, next);
        return;
    }
    // 转发
    let dataPack = {}
    dataPack.data = ctx.state.dataPack;
    dataPack.pid = ctx.state.pid;
    dataPack.aid = ctx.state.aid;
    // 转发至game-server
    let config = serverConfig.getGameServerFromAid(ctx.state.aid);
    let result = await s2sLogic.socketRpc(config.name, dataPack);
    let data = result.data;
    await ctx.method.send(data.router, data[data.router]);
    await next();
}