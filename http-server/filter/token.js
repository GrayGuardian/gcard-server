// 不需要Token即可访问的路由
const NOTTOKEN_ROUTER = ["login", "register"];
// 不需要区服ID即可访问的路由
const NOTAID_ROUTER = ["enterArea"]
module.exports = async (ctx, next) => {
    if (
        (ctx.state.token == null && NOTTOKEN_ROUTER.indexOf(ctx.state.router) == -1) ||
        (ctx.state.aid == null && NOTTOKEN_ROUTER.indexOf(ctx.state.router) == -1 && NOTAID_ROUTER.indexOf(ctx.state.router) == -1)
    ) {
        ctx.method.genError(ERROR_INFO.TOKEN_ERROR)
    }
    else {
        await next();
    }
}