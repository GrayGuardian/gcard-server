const connectRouter = new (require("../router/connect_router"))()
module.exports = async (ctx, next) => {
    let dataPack = pb.decode('socket.rpc', ctx.dataPack.data);
    if (dataPack == null) {
        ctx.method.genError(ERROR_CODE.RPC_DATA_ERROR)
        return;
    }
    ctx.state = {};
    ctx.state.router = dataPack.router;
    ctx.state.data = dataPack[ctx.state.router];
    if (ctx.state.data == null) {
        ctx.method.genError(ERROR_CODE.RPC_DATA_ERROR)
        return;
    }
    log.print(`[socket] [c2s] >>> [${ctx.state.router}] ${JSON.stringify(ctx.state.data)}`)
    let fun = connectRouter[ctx.state.router];
    if (fun != null) {
        fun(ctx, next);
    }
}