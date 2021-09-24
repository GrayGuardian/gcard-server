module.exports = async function (ctx, next) {
    // 返回错误码函数
    ctx.method.genError = async function (model, data) {
        model = model || ERROR_INFO.UNKNOWN_ERROR
        if (model == null || model.equal(ERROR_INFO.SUCCESS)) {
            log.error(`不可设置的错误码 code:${model.get_code()}`);
            return;
        }
        let dataPack = model.getClientErrorPackage(data);
        return await ctx.method.send("error", dataPack);
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