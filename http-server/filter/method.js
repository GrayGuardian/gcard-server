module.exports = async (ctx, next) => {
    ctx.state.code = Template.template_error_code.SUCCESS;
    // 返回错误码函数
    ctx.method.genError = function (errorCode) {
        errorCode = Template.template_error_code[errorCode.code];
        if (errorCode == null || util.equalErrorCode(errorCode, Template.template_error_code.SUCCESS)) {
            log.error(`不可设置的错误码 code:${errorCode.code}`);
            return;
        }
        ctx.state.code = errorCode;
        ctx.response.writeHead(errorCode.id, {
            "Content-Type": "application/octet-stream;"
        });

        ctx.method.callback();
    }
    // 返回函数
    ctx.method.callback = function (data) {
        let router;
        if (util.equalErrorCode(ctx.state.code, Template.template_error_code.SUCCESS)) {
            router = `${ctx.state.router}Ret`;
            data = data ?? {};
        }
        else {
            router = "error"
            data = { code: ctx.state.code }
        }
        let dataPack = {};
        dataPack.router = router;
        dataPack[router] = data;
        let buff = pb.encode('http.rpc', dataPack)
        if (buff == null) {
            ctx.method.genError(Template.template_error_code.RET_DATA_ERROR);
            return;
        }

        log.print(`[http] [s2c] >>> [${router}] ${JSON.stringify(data)}`)
        ctx.method.end(buff);
    }

    await next();
}