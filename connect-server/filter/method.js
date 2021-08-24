module.exports = async (ctx, next) => {
    ctx.method = {};
    ctx.method.genError = function (errorCode) {
        errorCode = Template.template_error_code[errorCode.code];
        if (errorCode == null || util.equalErrorCode(errorCode, Template.template_error_code.SUCCESS)) {
            log.error(`不可设置的错误码 code:${errorCode.code}`);
            return;
        }
        return ctx.method.send("error", { code: errorCode });
    }
    ctx.method.callback = function (data) {
        let router = `${ctx.state.router}Ret`;
        return ctx.method.send(router, data);
    }
    ctx.method.send = function (router, data) {
        data = data ?? {};
        let dataPack = {}
        dataPack.router = router;
        dataPack[router] = data;
        let buff = pb.encode("socket.rpc", dataPack);

        if (!pb.check("socket.rpc", buff, dataPack)) {
            ctx.method.genError(Template.template_error_code.RET_DATA_ERROR);
            return false;
        }
        log.print(`[socket] [s2c] >>> [${router}] ${JSON.stringify(data)}`)
        connectServer.server.send(ctx.socket, SOCKET_EVENT.DATA, buff)
        return true;
    }
    ctx.method.kickOut = function () {
        connectServer.server.kickOut(ctx.socket)
    }
    await next();
}