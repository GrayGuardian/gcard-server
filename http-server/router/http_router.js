var Router = function () { }

Router.prototype.register = async function (ctx, next) {
    log.print("注册");
    ctx.method.callback({ code: ERROR_CODE.SUCCESS });
    await next();
}

Router.prototype.login = async function (ctx, next) {
    log.print("登录");
    ctx.method.callback({ code: ERROR_CODE.SUCCESS });
    await next();
}
module.exports = Router;