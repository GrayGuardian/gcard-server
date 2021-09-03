var Router = function () { }
Router.prototype.test = async function (ctx, next) {
    // await s2sLogic.sendToID(ctx.state.pid, 'error', util.getError(0, ERROR_INFO.SUCCESS))
    console.log(">>>>>>>>>>>>>>>>>>>", await s2sLogic.pushIDToChannel('asfdsf', ctx.state.pid));
    console.log(">>>>>>>>>>>>>>>>>>>", await s2sLogic.pullIDToChannel('asfdsf', ctx.state.pid));
    console.log(">>>>>>>>>>>>>>>>>>>", await s2sLogic.sendToChannel('asfdsf', 'error', util.getError(0, ERROR_INFO.SUCCESS)));
    console.log(await ctx.method.kickOut());
    // await ctx.method.callback({ text: "我是服务端回发的测试消息 >>> " + ctx.state.pid })
    await next();
}

module.exports = Router;