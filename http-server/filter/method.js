
module.exports = async (ctx, next) => {
    // 返回错误码函数
    ctx.method.genError = function (model, data) {
        model = model || ERROR_INFO.UNKNOWN_ERROR
        if (model == null || model.equal(ERROR_INFO.SUCCESS)) {
            log.error(`不可设置的错误码 code:${model.get_code()}`);
            return;
        }
        let dataPack = model.getClientErrorPackage(data);
        return ctx.method.send("error", dataPack);
    }
    // 返回函数
    ctx.method.callback = function (data) {
        router = `${ctx.state.router}Ret`;

        return ctx.method.send(router, data);
    }

    ctx.method.send = function (router, data) {
        data = data || {};
        let dataPack = {}
        dataPack.router = router;
        dataPack[router] = data;
        let buff = pb.encode("http.rpc", dataPack);

        if (!pb.check("http.rpc", buff)) {
            ctx.method.genError(ERROR_INFO.RET_DATA_ERROR);
            return false;
        }
        log.print(`[http] [s2c] >>> [${router}] ${JSON.stringify(data)}`)

        ctx.response.writeHead(200, {
            "Content-Type": "application/octet-stream;"
        });
        ctx.method.end(buff);
        return true;
    }

    await next();
}