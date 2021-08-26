var Router = function () { }

Router.prototype.test = async function (ctx, next) {
    console.log("test logic event")
    // ctx.method.genError(ERROR_INFO.DB_ERROR);
    ctx.method.callback();
    await next();
}

module.exports = Router;