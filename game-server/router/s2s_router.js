var Router = function () { }

Router.prototype.test = async function (ctx, next) {
    console.log("test logic event")
    ctx.method.callback();
    await next();
}

// 玩家进入触发 顶号不触发 用于处理数据
Router.prototype.playerEnter = async function (ctx, next) {
    // log.print(`玩家进入 >> ${JSON.stringify(ctx.state.data)}`)
    await serverLogic.playerEnter(ctx.state.data.player);
    ctx.method.callback();
    await next();
}
// 玩家退出触发 顶号不触发 用于处理数据
Router.prototype.playerLeave = async function (ctx, next) {
    // log.print(`玩家离开 >> ${JSON.stringify(ctx.state.data)}`)
    ctx.method.callback();
    await next();
}
module.exports = Router;