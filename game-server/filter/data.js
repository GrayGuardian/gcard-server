module.exports = async function (ctx, next) {
    console.log(ctx.state.dataPack);
    ctx.state.router = ctx.state.dataPack.router;
    ctx.state.data = ctx.state.dataPack[ctx.state.router];
    if (ctx.state.data == null) {
        ctx.method.genError(ERROR_INFO.RPC_DATA_ERROR)
        return;
    }
    await next();
}