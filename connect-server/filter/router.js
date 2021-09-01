const connectRouter = new (require("../router/connect_router"))()
module.exports = async (ctx, next) => {
    log.print(`[socket] [c2s] >>> [${ctx.state.router}] ${JSON.stringify(ctx.state.data)}`)
    // 本地存在则本地执行
    let fun = connectRouter[ctx.state.router];
    if (fun != null) {
        fun(ctx, next);
        return;
    }
    // 转发至game-server
}