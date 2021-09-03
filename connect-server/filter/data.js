// 不需要登录即可访问的路由
const NOTLOGIN_ROUTER = ["conn"]
module.exports = async (ctx, next) => {
    ctx.state = {};
    let dataPack = pb.decode('socket.rpc', ctx.dataPack.data);
    if (dataPack == null) {
        ctx.method.genError(ERROR_INFO.RPC_DATA_ERROR)
        return;
    }
    ctx.state.dataPack = dataPack;
    ctx.state.router = dataPack.router;
    ctx.state.data = dataPack[ctx.state.router];
    if (ctx.state.data == null) {
        ctx.method.genError(ERROR_INFO.RPC_DATA_ERROR)
        return;
    }
    ctx.state.pid = connectServer.getIdxOfSocket(ctx.socket);
    if (ctx.state.pid == null && NOTLOGIN_ROUTER.indexOf(ctx.state.router) == -1) {
        ctx.method.genError(ERROR_INFO.TOKEN_ERROR)
        return;
    }
    ctx.state.aid = await redisLogic.getPlayerAid(ctx.state.pid);

    await next();
}