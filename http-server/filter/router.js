const httpRouter = new (require("../router/http_router"))()
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
    log.print(`[http] [c2s] >>> [${ctx.state.router}] ${JSON.stringify(ctx.state.data)}`)
    let fun = httpRouter[ctx.state.router];
    if (fun != null) {
        fun(ctx, next);
    }
}