var Router = function () { }

Router.prototype.kickOutFromIdx = async function (ctx, next) {
    let flag = await connectServer.kickOutFromIdx(ctx.state.data.idx);
    ctx.method.callback({ flag: flag });
    await next();
}
Router.prototype.pushIDToChannel = async function (ctx, next) {
    let flag = await connectServer.pushIDToChannel(ctx.state.data.key, ctx.state.data.idx);
    ctx.method.callback({ flag: flag });
    await next();
}
Router.prototype.pullIDToChannel = async function (ctx, next) {
    let flag = await connectServer.pullIDToChannel(ctx.state.data.key, ctx.state.data.idx);
    ctx.method.callback({ flag: flag });
    await next();
}
Router.prototype.sendToID = async function (ctx, next) {
    let dataPack = ctx.state.data.data
    let flag = await connectServer.sendToID(ctx.state.data.idx, dataPack.router, dataPack[dataPack.router]);
    ctx.method.callback({ flag: flag });
    await next();
}
Router.prototype.sendToChannel = async function (ctx, next) {
    let dataPack = ctx.state.data.data
    let count = await connectServer.sendToChannel(ctx.state.data.key, dataPack.router, dataPack[dataPack.router]);
    ctx.method.callback({ count: count });
    await next();
}
module.exports = Router;