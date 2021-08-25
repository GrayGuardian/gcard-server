var Router = function () { }
// 注册
Router.prototype.register = async function (ctx, next) {
    // 校验用户名格式
    if (!REGULAR_CODE.USERNAME_VALID(ctx.state.data.username)) {
        ctx.method.genError(ERROR_CODE.USERNAME_NOTVALID)
        await next();
        return;
    }
    // 校验密码格式
    if (!REGULAR_CODE.PASSWORD_VALID(ctx.state.data.password)) {
        ctx.method.genError(ERROR_CODE.PASSWORD_NOTVALID)
        await next();
        return;
    }
    // 尝试注册
    let info = await mySqlLogic.register(ctx.state.data.username, ctx.state.data.password);
    if (info == null) {
        ctx.method.genError(ERROR_CODE.USERNAME_EXIST)
        await next();
        return;
    }
    let token = util.tokenSerialize({ uid: info.uid })
    let areas = await mySqlLogic.getValidAreaInfos();
    ctx.method.callback({ info: info, token: token, areas: areas })
    await next();
}
// 登录
Router.prototype.login = async function (ctx, next) {
    let info = await mySqlLogic.login(ctx.state.data.username, ctx.state.data.password);
    if (info == null) {
        ctx.method.genError(ERROR_CODE.PASSWORD_ERROR)
        await next();
        return;
    }
    let token = util.tokenSerialize({ uid: info.uid });
    let areas = await mySqlLogic.getValidAreaInfos();
    ctx.method.callback({ info: info, token: token, areas: areas })
    await next();
}

module.exports = Router;