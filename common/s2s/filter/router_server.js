module.exports = async (ctx, next) => {
    let s2sdata = ctx.state.s2sdata;
    if (s2sdata.type == S2S_TYPE.RPC && s2sdata.to == SERVER_NAME) {
        log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(ctx.state.data)}`)
        // 本地操作
        let fun = s2sRouter[s2sdata.router];
        if (fun != null) {
            await fun(ctx, next);
        }
        return;
    }
    // 转发操作
    ctx.send(s2sdata)

    await next();
}