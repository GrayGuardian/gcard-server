var Router = function () { }
Router.prototype.conn = async function (ctx, next) {
    // 校验token

    // 校验成功 允许连接
    await connectServer.onClientEnter(ctx.state.data.pid, ctx.socket);
    await ctx.method.callback({ code: ERROR_CODE.SUCCESS })
    await next();
}
Router.prototype.test = async function (ctx, next) {
    await ctx.method.callback();
    await next();
}

module.exports = Router;