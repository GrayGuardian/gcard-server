module.exports = async function (ctx, next) {
    // 返回错误码函数
    ctx.method.genError = async function (info, data) {
        info = info ?? ERROR_INFO.UNKNOWN_ERROR
        info = ERROR_INFO[info.code];
        if (info == null || util.equalErrorInfo(info, ERROR_INFO.SUCCESS)) {
            log.error(`不可设置的错误码 code:${info.code}`);
            return;
        }
        let error = util.getError(1, info, data)
        return await ctx.method.send("error", error);
    }
    // 返回函数
    ctx.method.callback = async function (data) {
        await ctx.method.send(`${ctx.state.router}Ret`, data);
    }
    ctx.method.kickOut = async function () {
        return await s2sLogic.kickOutFromIdx(ctx.state.pid)
    }
    await next();
}