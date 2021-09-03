var Router = function () { }
Router.prototype.test = async function (ctx, next) {
    await ctx.method.callback({ text: "我是服务端回发的测试消息 >>> " + ctx.state.pid })
    await next();
}

module.exports = Router;