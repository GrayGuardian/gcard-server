
module.exports = async (ctx, next) => {
    // 返回错误码函数
    ctx.method.genError = function (errorCode) {
        errorCode = ERROR_CODE[errorCode.code];
        if (errorCode == null || util.equalObjectValue(errorCode, ERROR_CODE.SUCCESS)) {
            log.error(`不可设置的错误码 code:${errorCode.code}`);
            return;
        }
        return ctx.method.send(errorCode.id, "error", { code: errorCode });
    }
    // 返回函数
    ctx.method.callback = function (data) {
        router = `${ctx.state.router}Ret`;

        return ctx.method.send(ERROR_CODE.SUCCESS.id, router, data);
    }

    ctx.method.send = function (code, router, data) {
        data = data ?? {};
        let dataPack = {}
        dataPack.router = router;
        dataPack[router] = data;
        let buff = pb.encode("http.rpc", dataPack);

        if (!pb.check("http.rpc", buff)) {
            ctx.method.genError(ERROR_CODE.RET_DATA_ERROR);
            return false;
        }
        log.print(`[http] [s2c] >>> [${router}] ${JSON.stringify(data)}`)

        ctx.response.writeHead(code, {
            "Content-Type": "application/octet-stream;"
        });
        ctx.method.end(buff);
        return true;
    }

    await next();
}