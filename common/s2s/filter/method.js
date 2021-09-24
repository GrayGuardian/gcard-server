module.exports = async (ctx, next) => {
    ctx.method = {};
    // 返回错误码函数
    ctx.method.genError = function (model, data) {
        model = model || ERROR_INFO.UNKNOWN_ERROR
        if (model == null || model.equal(ERROR_INFO.SUCCESS)) {
            log.error(`不可设置的错误码 code:${model.get_code()}`);
            return;
        }
        let dataPack = model.getServerErrorPackage(data);
        return ctx.method.send("error", dataPack);
    }
    // 返回函数
    ctx.method.callback = function (data) {
        ctx.method.send(`${ctx.state.router}Ret`, data);
    }
    ctx.method.send = (router, data) => {
        let s2sdata = { code: ctx.state.s2sdata.code, from: SERVER_NAME, to: ctx.state.s2sdata.from, router: router, type: S2S_TYPE.RET };
        s2sdata[router] = data
        ctx.send(s2sdata);
    }
    await next();
}