var Router = function () { }
Router.prototype.register = async function (ctx, next) {
    // 校验用户名格式
    if (!REGULAR_CODE.USERNAME_VALID(ctx.state.data.username)) {
        ctx.method.genError(ERROR_INFO.USERNAME_NOTVALID)
        await next();
        return;
    }
    // 校验密码格式
    if (!REGULAR_CODE.PASSWORD_VALID(ctx.state.data.password)) {
        ctx.method.genError(ERROR_INFO.PASSWORD_NOTVALID)
        await next();
        return;
    }
    // 尝试注册
    let info = await mysqlLogic.register(ctx.state.data.username, ctx.state.data.password);
    if (info.error != null) {
        ctx.method.genError(ERROR_INFO[info.error])
        await next();
        return;
    }
    let token = jwt.encode({ uid: info.uid })
    let areas = await mysqlLogic.getValidAreaInfos();
    ctx.method.callback({ info: info, token: token, areas: areas })
    await next();
}
Router.prototype.login = async function (ctx, next) {
    let info = await mysqlLogic.login(ctx.state.data.username, ctx.state.data.password);
    if (info.error != null) {
        ctx.method.genError(ERROR_INFO[info.error])
        await next();
        return;
    }
    if (info.state == GAME_CONST.USER_STATE.BAN && info.banTime != null) {
        ctx.method.genError(ERROR_INFO.USER_BAN, { time: info.banTime })
        await next();
        return;
    }
    let token = jwt.encode({ uid: info.uid });
    let areas = await mysqlLogic.getValidAreaInfos();
    ctx.method.callback({ info: info, token: token, areas: areas })
    await next();
}

Router.prototype.enterArea = async function (ctx, next) {
    let info = await mysqlLogic.getAreaInfo(ctx.state.data.aid);
    // 区服是否存在
    if (info == null || info.state == GAME_CONST.AREA_STATE.INVALID) {
        ctx.method.genError(ERROR_INFO.DATA_NOTEXIST);
        await next();
        return;
    }
    // 区服是否维护
    if (info.state == GAME_CONST.AREA_STATE.MAINTAIN) {
        ctx.method.genError(ERROR_INFO.AREA_MAINTENANCE)
        await next();
        return;
    }
    let token = jwt.encode({ uid: ctx.state.uid, aid: info.aid });
    let players = await mysqlLogic.getValidPlayerInfos(ctx.state.uid, info.aid)
    ctx.method.callback({ token: token, players: players })
    await next();
}

Router.prototype.enterGame = async function (ctx, next) {
    // 此处不校验pid真实性，传递至网关服务器校验
    let token = jwt.encode({ uid: ctx.state.uid, aid: ctx.state.aid, pid: ctx.state.data.pid });
    let config = serverConfig.getConnectServerFromAid(ctx.state.aid);
    ctx.method.callback({ token: token, config: config })
    await next();
}
module.exports = Router;