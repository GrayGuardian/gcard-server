var Router = function () { }

Router.prototype.test = async function (ctx, next) {
    console.log("test logic event")
    ctx.method.callback();
    await next();
}

module.exports = Router;