// 不需要Token即可访问的路由
const NOTTOKEN_ROUTER = ["login", "register"];
module.exports = async (ctx, next) => {
    if (
        ctx.state.token != null ||  // Token值已存在
        NOTTOKEN_ROUTER.indexOf(ctx.state.router) != -1  //不需要检测Token值
    ) {
        await next();
    }
    else {
        ctx.method.genError(ERROR_INFO.TOKEN_ERROR)
    }
}