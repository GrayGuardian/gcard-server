const connectRouter = new (require("../router/connect_router"))()
module.exports = async (ctx, next) => {
    log.print(`[socket] [c2s] >>> [${ctx.state.router}] ${JSON.stringify(ctx.state.data)}`)
    let fun = connectRouter[ctx.state.router];
    if (fun != null) {
        fun(ctx, next);
    }
}