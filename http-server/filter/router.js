const httpRouter = new (require("../router/http_router"))()
module.exports = async (ctx, next) => {
    log.print(`[http] [c2s] >>> [${ctx.state.router}] ${JSON.stringify(ctx.state.data)}`)
    let fun = httpRouter[ctx.state.router];
    if (fun != null) {
        fun(ctx, next);
    }
}