module.exports = async (ctx, next) => {
    ctx.state = {};
    let dataPack = pb.decode('socket.rpc', ctx.dataPack.data);
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
    await next();
}