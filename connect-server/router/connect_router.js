var Router = function () { }
Router.prototype.conn = async function (ctx, next) {
    // token连数据库校验

    // 校验成功 允许连接
    await connectServer.onClientEnter(ctx.state.data.pid, ctx.socket);
    ctx.method.callback({ code: SUCCESS_CODE })
    await next();
}
Router.prototype.test = async function (ctx, next) {
    ctx.method.callback();
    await next();
}

module.exports = Router;