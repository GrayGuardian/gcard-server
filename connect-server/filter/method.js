module.exports = async (ctx, next) => {
    ctx.method = {};
    ctx.method.genError = async function (model, cb) {
        return await connectServer.genError(ctx.socket, model, cb)
    }
    ctx.method.callback = async function (data, cb) {
        let router = `${ctx.state.router}Ret`;
        return await ctx.method.send(router, data, cb);
    }
    ctx.method.send = async function (router, data, cb) {
        return await connectServer.send(ctx.socket, router, data, cb)
    }
    ctx.method.kickOut = async function () {
        await connectServer.kickOut(ctx.socket)
    }
    await next();
}