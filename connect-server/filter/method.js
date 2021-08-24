module.exports = async (ctx, next) => {
    ctx.method = {};
    ctx.method.genError = function (errorCode, cb) {
        return connectServer.genError(ctx.socket, errorCode, cb)
    }
    ctx.method.callback = function (data, cb) {
        let router = `${ctx.state.router}Ret`;
        return ctx.method.send(router, data, cb);
    }
    ctx.method.send = function (router, data, cb) {
        return connectServer.send(ctx.socket, router, data, cb)
    }
    ctx.method.kickOut = function () {
        connectServer.kickOut(ctx.socket)
    }
    await next();
}