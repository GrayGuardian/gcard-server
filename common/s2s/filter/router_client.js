module.exports = async (ctx, next) => {
    let s2sdata = ctx.state.s2sdata;
    // 首次接收
    if (s2sdata.type == S2S_TYPE.RPC && s2sdata.to == SERVER_NAME) {
        log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(ctx.state.data)}`)
        let fun = s2sRouter[s2sdata.router];
        if (fun != null) {
            await fun(ctx, next);
        }
        return;
    }
    // 回调
    if (s2sdata.type == S2S_TYPE.RET && s2sdata.to == SERVER_NAME) {
        log.print(`[s2s] [${s2sdata.code}] [${s2sdata.from}] to [${s2sdata.to}] [${s2sdata.router}] >>> ${JSON.stringify(ctx.state.data)}`)
        ctx.onRetFunc(s2sdata);
        return;
    }

    await next();
}