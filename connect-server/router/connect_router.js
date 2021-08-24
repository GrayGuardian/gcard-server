var Router = function () { }

Router.prototype.test = async function (ctx, next) {
    ctx.method.callback();
    await next();
}

module.exports = Router;