
module.exports = async (ctx, next) => {
    let dataPack = pb.decode('http.rpc', ctx.data);
    if (dataPack == null) {
        ctx.method.genError(ERROR_CODE.RPC_DATA_ERROR)
        return;
    }
    ctx.state.router = dataPack.router;
    ctx.state.data = dataPack[ctx.state.router];
    if (ctx.state.data == null) {
        ctx.method.genError(ERROR_CODE.RPC_DATA_ERROR)
        return;
    }
    if (ctx.request.headers.token != '') {
        ctx.state.token = util.tokenDeserialize(ctx.request.headers.token)
    }
    if (ctx.state.token != null) {
        ctx.state.uid = ctx.state.token.uid;
        ctx.state.aid = ctx.state.token.aid;
        ctx.state.pid = ctx.state.token.pid;
    }
    await next();
}