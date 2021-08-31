var Router = function () { }
Router.prototype.conn = async function (ctx, next) {
    // 校验token
    let token = util.tokenDeserialize(ctx.state.data.token);
    if (token == null || token.uid == null || token.aid == null || token.pid == null) {
        await ctx.method.kickOut();
        return;
    }
    // 校验pid
    let player = await mysqlLogic.getPlayerInfo(token.pid);
    if (player == null || player.state != GAME_CONST.PLAYER_STATE.NORMAL || player.uid != token.uid || player.aid != token.aid) {
        await ctx.method.kickOut();
        return;
    }
    // 校验成功 允许连接
    await connectServer.onClientEnter(player.pid, ctx.socket);
    await ctx.method.callback({ player: player })
    await next();
}

module.exports = Router;