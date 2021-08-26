module.exports = async (ctx, next) => {
    ctx.state = {};
    ctx.state.s2sdata = pb.decode("s2s.rpc", ctx.dataPack.data);
    if (ctx.state.s2sdata == null) {
        ctx.method.genError(ERROR_INFO.RPC_DATA_ERROR);
        return;
    }
    ctx.state.router = ctx.state.s2sdata.router
    ctx.state.data = ctx.state.s2sdata[ctx.state.router];
    if (ctx.state.data == null) {
        ctx.method.genError(ERROR_INFO.RPC_DATA_ERROR)
        return;
    }
    await next();
}