
module.exports = async (ctx, next) => {
    // 返回错误码函数
    ctx.method.genError = function (info, data) {
        info = info ?? ERROR_INFO.UNKNOWN_ERROR
        info = ERROR_INFO[info.code];
        if (info == null || util.equalErrorInfo(info, ERROR_INFO.SUCCESS)) {
            log.error(`不可设置的错误码 code:${info.code}`);
            return;
        }
        let dataPack = util.getError(0, info, data)
        return ctx.method.send(info.id, "error", dataPack);
    }
    // 返回函数
    ctx.method.callback = function (data) {
        router = `${ctx.state.router}Ret`;

        return ctx.method.send(ERROR_INFO.SUCCESS.id, router, data);
    }

    ctx.method.send = function (code, router, data) {
        data = data ?? {};
        let dataPack = {}
        dataPack.router = router;
        dataPack[router] = data;
        let buff = pb.encode("http.rpc", dataPack);

        if (!pb.check("http.rpc", buff)) {
            ctx.method.genError(ERROR_INFO.RET_DATA_ERROR);
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